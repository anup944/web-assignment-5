/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anup Oli Student ID: 146858238 Date: 17th Feb, 2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const projectData = require("./modules/projects");

const studentName = "Anup Oli";
const studentId = "146858238";

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Predefined projects mapped by sector
const hardcodedProjects = {
  "Plastic Bags": [
    { id: 101, title: "Reduce Single-Use Plastic Bag Project", sector: "Plastic Bags", description: "Encourage the use of reusable bags in local stores." },
    { id: 102, title: "Plastic Bag Recycling Initiative", sector: "Plastic Bags", description: "Collect and recycle plastic bags to reduce waste." }
  ],
  "Carbon Gases": [
    { id: 201, title: "Carbon Capture Program", sector: "Carbon Gases", description: "Implement technology to capture and store CO2 emissions." },
    { id: 202, title: "Greenhouse Gas Reduction", sector: "Carbon Gases", description: "Work with industries to lower carbon footprints." }
  ],
  "Plantation": [
    { id: 301, title: "Urban Tree Planting", sector: "Plantation", description: "Plant trees in urban areas to improve air quality." },
    { id: 302, title: "Community Garden Initiative", sector: "Plantation", description: "Promote local gardening and planting for a greener community." }
  ]
};

// Route for Home page (index)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Route for About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Route for solutions/projects
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;

  if (sector) {
    if (hardcodedProjects[sector]) {
      return res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        projects: hardcodedProjects[sector]
      });
    }

    // If not hardcoded, fetch from projectData module
    projectData.getProjectsBySector(sector)
      .then((projects) => {
        if (projects.length === 0) {
          return res.status(404).json({
            studentName,
            studentId,
            timestamp: new Date().toISOString(),
            error: `No projects found for sector: ${sector}`
          });
        }
        res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects
        });
      })
      .catch(() => {
        res.status(500).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: "Internal server error"
        });
      });
  } else {
    // No sector provided, return all projects
    projectData.getAllProjects()
      .then((projects) => {
        res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects
        });
      })
      .catch(() => {
        res.status(500).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: "Internal server error"
        });
      });
  }
});

// Route for individual project by ID
app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  projectData.getProjectById(projectId)
    .then((project) => {
      if (!project) {
        return res.status(404).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: `Project with ID ${projectId} not found`
        });
      }
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        project
      });
    })
    .catch(() => {
      res.status(500).json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        error: "Internal server error"
      });
    });
});

// Custom 404 error page
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// POST route for handling requests at /post-request
app.post("/post-request", (req, res) => {
  res.json({
    studentName,
    studentId,
    timestamp: new Date().toISOString(),
    requestBody: req.body
  });
});

// Initialize project data and start the server
projectData.Initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize project data:", err);
  });
