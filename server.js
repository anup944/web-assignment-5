const express = require("express"); // Import Express framework
const path = require("path"); // Import path module for handling file paths
const projectData = require("./modules/projects"); // Import project data module

const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 8080; // Set the port number

app.use(express.static(path.join(__dirname, "public"))); // Ensure the correct path is used

// Initialize projects data and start server
projectData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // Start server and log message
    });
  })
  .catch((err) => {
    console.error("Failed to initialize data:", err); // Log error if initialization fails
  });

// Routes

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html")); // Serve home page
});

// About route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html")); // Serve about page
});

// Projects route with optional sector filter
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector; // Get sector query parameter

  if (sector) {
    projectData
      .getProjectsBySector(sector) // Get projects for the given sector
      .then((data) => res.json(data)) // Respond with project data in JSON format
      .catch((err) => res.status(404).json({ message: err })); // Handle errors
  } else {
    projectData
      .getAllProjects() // Get all projects if no sector is specified
      .then((data) => res.json(data)) // Respond with project data in JSON format
      .catch((err) => res.status(404).json({ message: err })); // Handle errors
  }
});

// Project route to get a specific project by ID
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id); // Parse project ID from request parameters

  projectData
    .getProjectById(id) // Get project by ID
    .then((data) => res.json(data)) // Respond with project data in JSON format
    .catch((err) => res.status(404).json({ message: err })); // Handle errors
});

// Custom 404 Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html")); // Serve 404 error page
});
