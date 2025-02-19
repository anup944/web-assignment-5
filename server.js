/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anup Oli Student ID: 146858238 Date: 18th Feb,2025
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

  // If a specific sector is provided
  if (sector) {
    switch (sector) {
      // Hardcode data for Plastic Bags
      case "Plastic Bags":
        return res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects: [
            {
              id: 101,
              title: "Reduce Single-Use Plastic Bag Project",
              sector: "Plastic Bags",
              description: "Encourage the use of reusable bags in local stores."
            },
            {
              id: 102,
              title: "Plastic Bag Recycling Initiative",
              sector: "Plastic Bags",
              description: "Collect and recycle plastic bags to reduce waste."
            }
          ]
        });

      // Hardcode data for Carbon Gases
      case "Carbon Gases":
        return res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects: [
            {
              id: 201,
              title: "Carbon Capture Program",
              sector: "Carbon Gases",
              description: "Implement technology to capture and store CO2 emissions."
            },
            {
              id: 202,
              title: "Greenhouse Gas Reduction",
              sector: "Carbon Gases",
              description: "Work with industries to lower carbon footprints."
            }
          ]
        });

      // Hardcode data for Plantation
      case "Plantation":
        return res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects: [
            {
              id: 301,
              title: "Urban Tree Planting",
              sector: "Plantation",
              description: "Plant trees in urban areas to improve air quality."
            },
            {
              id: 302,
              title: "Community Garden Initiative",
              sector: "Plantation",
              description: "Promote local gardening and planting for a greener community."
            }
          ]
        });

      // Otherwise, use your existing projectData logic
      default:
        projectData.getProjectsBySector(sector)
          .then((projects) => {
            res.json({
              studentName,
              studentId,
              timestamp: new Date().toISOString(),
              projects
            });
          })
          .catch((err) => {
            res.status(404).json({
              studentName,
              studentId,
              timestamp: new Date().toISOString(),
              error: err
            });
          });
        return; // Make sure we don't continue past this point
    }

  } else {
    // No sector provided; return all projects
    projectData.getAllProjects()
      .then((projects) => {
        res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects
        });
      })
      .catch((err) => {
        res.status(500).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: err
        });
      });
  }
});

// Route for individual project by id
app.get("/solutions/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  projectData.getProjectById(projectId)
    .then((project) => {
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        project
      });
    })
    .catch((err) => {
      res.status(404).json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        error: err
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
