/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Mansan Silwal Student ID: 132326232 Date: 1st Feb,2025
*
********************************************************************************/


const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const projectData = require("./modules/projects");


const studentName = "Mansan Silwal";
const studentId = "132326232";

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Assignment 2: ${studentName} - ${studentId}`);
});

app.get("/solutions/projects", (req, res) => {
  projectData.getAllProjects()
    .then(projects => {
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        projects
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

app.get("/solutions/projects/id-demo", (req, res) => {
  projectData.getProjectById(18)
    .then(project => {
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        project
      });
    })
    .catch(err => {
      res.status(404).json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        error: err
      });
    });
});

app.get("/solutions/projects/sector-demo", (req, res) => {
  
  projectData.getProjectsBySector("Industry")
    .then(projects => {
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        projects
      });
    })
    .catch(err => {
      res.status(404).json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        error: err
      });
    });
});

projectData.Initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize project data:", err);
  });
