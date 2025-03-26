/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anup Oli Student ID: 146858238 Date: 2025/03/26
*
********************************************************************************/

require('dotenv').config();
const express = require("express");
const path = require("path");
const { Sequelize } = require('sequelize');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Enhanced Sequelize configuration for Vercel + Neon.tech
const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Neon.tech
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import project module
const projectModule = require("./modules/projects");
const { initialize, getAllProjects, getProjectById, getProjectsBySector, 
        addProject, getAllSectors, editProject, deleteProject } = projectModule;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint (required for Vercel)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: sequelize.authenticate() ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.get("/", (req, res) => res.render("home", { page: "/" }));
app.get("/about", (req, res) => res.render("about", { page: "/about" }));

// Solutions/Projects route
app.get("/solutions/projects", async (req, res) => {
  try {
    const sector = req.query.sector;
    const projects = sector ? await getProjectsBySector(sector) : await getAllProjects();

    if (!projects || projects.length === 0) {
      return res.status(404).render("404", { 
        message: sector ? `No projects found for sector: ${sector}` : "No projects available.",
        page: "/solutions/projects"
      });
    }

    res.render("projects", {
      page: "/solutions/projects",
      projects,
      sector
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).render("500", { 
      message: "An error occurred while fetching projects. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Individual project route
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) throw new Error("Invalid project ID");

    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    res.render("project", { 
      project,
      page: "/solutions/projects"
    });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(404).render("404", {
      message: err.message,
      page: "/solutions/projects"
    });
  }
});

// Add Project routes
app.get("/solutions/addProject", async (req, res) => {
  try {
    const sectors = await getAllSectors();
    res.render("addProject", { 
      page: "/solutions/addProject",
      sectors 
    });
  } catch (err) {
    console.error("Error loading form:", err);
    res.status(500).render("500", { 
      message: "Failed to load form data",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post("/solutions/addProject", async (req, res) => {
  try {
    await addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).render("500", { 
      message: "Failed to add project",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Edit/Delete routes (similar error handling as above)
// ... [keep your existing edit/delete routes] ...

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { 
    message: "Page not found",
    page: ""
  });
});

// Server initialization
const startServer = async () => {
  try {
    await initialize();
    console.log("Database initialized successfully");
    
    if (process.env.VERCEL) {
      console.log("Running in Vercel environment");
      module.exports = app;
    } else {
      app.listen(HTTP_PORT, () => {
        console.log(`Server running on port ${HTTP_PORT}`);
        console.log(`Database: ${sequelize.config.host}`);
      });
    }
  } catch (err) {
    console.error("Fatal initialization error:", err);
    process.exit(1);
  }
};

startServer();