/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Anup Oli Student ID: 146858238 Date:2025/03/25
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import project module
const projectModule = require("./modules/projects");
const { initialize, getAllProjects, getProjectById, getProjectsBySector, addProject, getAllSectors, editProject, deleteProject } = projectModule;

// Middleware for form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

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
      message: "An error occurred while fetching projects. Please try again later."
    });
  }
});

// Route for individual projects
app.get("/solutions/projects/:id", async (req, res) => {
  const projectId = parseInt(req.params.id, 10);

  if (isNaN(projectId)) {
    return res.status(400).render("404", {
      message: "Invalid project ID. Please provide a numeric ID.",
      page: "/solutions/projects"
    });
  }

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { 
        message: `Project with ID ${projectId} not found.`,
        page: "/solutions/projects"
      });
    }

    res.render("project", { 
      project,
      page: "/solutions/projects"
    });
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    res.status(500).render("500", { 
      message: "An error occurred while fetching the project. Please try again later."
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
    console.error("Error fetching sectors:", err);
    res.status(500).render("500", { 
      message: "An error occurred while loading the form. Please try again later."
    });
  }
});

app.post("/solutions/addProject", async (req, res) => {
  try {
    await addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    console.error("Error adding project:", err);
    res.render("500", { 
      message: `I'm sorry, but we have encountered the following error: ${err}`
    });
  }
});

// Edit Project routes
app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const [project, sectors] = await Promise.all([
      getProjectById(projectId),
      getAllSectors()
    ]);
    
    res.render("editProject", { 
      page: "",
      project,
      sectors 
    });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(404).render("404", { 
      message: err,
      page: "/solutions/projects"
    });
  }
});

app.post("/solutions/editProject", async (req, res) => {
  try {
    await editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    console.error("Error updating project:", err);
    res.render("500", { 
      message: `I'm sorry, but we have encountered the following error: ${err}`
    });
  }
});

// Delete Project route
app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    await deleteProject(projectId);
    res.redirect("/solutions/projects");
  } catch (err) {
    console.error("Error deleting project:", err);
    res.render("500", { 
      message: `I'm sorry, but we have encountered the following error: ${err}`
    });
  }
});

// 404 Page Not Found handler
app.use((req, res) => {
  res.status(404).render("404", { 
    message: "Page not found",
    page: ""
  });
});

// Initialize database and start the server
initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });