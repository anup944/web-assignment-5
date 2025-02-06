const express = require("express");
const projectData = require("./modules/projects");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

/********************************************************************************
* WEB322 – Assignment 02
*
* This assignment represents my own work following Seneca's Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Anup Oli | Student ID: 146858238 | Date: 01/28/2025
*
********************************************************************************/

// Load project data before launching the server
projectData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Initialization of project data failed:", err);
    });

// Define routes
app.get("/", (req, res) => {
    res.send("Assignment 2: Anup Oli - 146858238");
});

// Route to fetch all projects
app.get("/solutions/projects", (req, res) => {
    projectData.getAllProjects()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

// Route to fetch a project by ID (example with ID 9)
app.get("/solutions/projects/id-demo", (req, res) => {
    projectData.getProjectById(9)
        .then(project => res.json(project))
        .catch(err => res.status(404).send(err));
});

// Route to fetch projects based on sector (example with "agriculture")
app.get("/solutions/projects/sector-demo", (req, res) => {
    projectData.getProjectsBySector("agriculture")
        .then(projects => res.json(projects))
        .catch(err => res.status(404).send(err));
});
