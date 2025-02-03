const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function Initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = [];
      projectData.forEach(project => {
        const matchingSector = sectorData.find(sector => sector.id === project.sector_id);
        const sectorName = matchingSector ? matchingSector.sector_name : "";
        projects.push({ ...project, sector: sectorName });
      });
      resolve();
    } catch (error) {
      reject("Error initializing projects: " + error);
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("Projects not initialized or empty");
    }
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find(project => project.id === projectId);
    if (project) {
      resolve(project);
    } else {
      reject(`Unable to find requested project with id: ${projectId}`);
    }
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const searchTerm = sector.toLowerCase();
    const filteredProjects = projects.filter(project => project.sector.toLowerCase().includes(searchTerm));
    if (filteredProjects.length > 0) {
      resolve(filteredProjects);
    } else {
      reject(`Unable to find requested projects for sector: ${sector}`);
    }
  });
}

module.exports = { Initialize, getAllProjects, getProjectById, getProjectsBySector };
