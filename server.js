/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anup Oli Student ID: 146858238 Date: [Current Date]
*
********************************************************************************/

require('dotenv').config();
const express = require("express");
const path = require("path");
const { Sequelize } = require('sequelize');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Database Configuration
const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT COUNT(*) FROM "Projects"');
    res.json({
      status: 'OK',
      projectCount: results[0].count,
      database: 'Connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      error: err.message
    });
  }
});

// Routes
app.get("/", (req, res) => res.render("home", { page: "/" }));
app.get("/about", (req, res) => res.render("about", { page: "/about" }));

// Projects Routes
app.get("/solutions/projects", async (req, res) => {
  try {
    const sector = req.query.sector;
    let query = 'SELECT p.*, s.sector_name FROM "Projects" p JOIN "Sectors" s ON p.sector_id = s.id';
    
    if (sector) {
      query += ' WHERE s.sector_name ILIKE :sector';
    }

    const projects = await sequelize.query(query, {
      replacements: { sector: `%${sector}%` },
      type: sequelize.QueryTypes.SELECT
    });

    if (!projects.length) {
      return res.status(404).render("404", {
        message: sector ? `No projects found for sector: ${sector}` : "No projects available",
        page: "/solutions/projects"
      });
    }

    res.render("projects", {
      page: "/solutions/projects",
      projects,
      sector
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).render("500", {
      message: "An error occurred while fetching projects"
    });
  }
});

app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const project = await sequelize.query(
      'SELECT p.*, s.sector_name FROM "Projects" p JOIN "Sectors" s ON p.sector_id = s.id WHERE p.id = :id LIMIT 1',
      {
        replacements: { id: req.params.id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!project.length) {
      return res.status(404).render("404", {
        message: `Project with ID ${req.params.id} not found`,
        page: "/solutions/projects"
      });
    }

    res.render("project", {
      project: project[0],
      page: "/solutions/projects"
    });
  } catch (err) {
    res.status(500).render("500", {
      message: "An error occurred while fetching the project"
    });
  }
});

// Add/Edit/Delete Routes (similar pattern as above)

// Error Handlers
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    page: ""
  });
});

// Server Initialization
sequelize.sync()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize database:", err);
  });

module.exports = app;