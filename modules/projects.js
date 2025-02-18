<<<<<<< HEAD
const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Reset the projects array to ensure fresh data
            projects = [];

            // Populate the projects array with data from projectData
            projectData.forEach(project => {
                // Locate the corresponding sector
                const matchingSector = sectorData.find(sector => 
                    sector.id === project.sector_id
                );
                
                // Include the sector name in the project object
                const projectWithSector = {
                    ...project,
                    sector: matchingSector ? matchingSector.sector_name : null
                };
                
                // Add the processed project to the list
                projects.push(projectWithSector);
            });
            
            resolve();
        } catch (err) {
            reject("Error encountered during initialization: " + err);
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        try {
            resolve(projects);
        } catch (err) {
            reject("Error retrieving all projects: " + err);
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        try {
            const project = projects.find(p => p.id === projectId);
            console.log(project);
            
            if (project) {
                resolve(project);
            } else {
                reject("Project not found with the given ID");
            }
        } catch (err) {
            reject("Error retrieving project by ID: " + err);
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        try {
            // Validate sector input
            if (!sector || typeof sector !== 'string') {
                reject("Sector must be a valid non-empty string");
                return;
            }

            // Convert sector name to lowercase for case-insensitive matching
            const searchTerm = sector.toLowerCase();

            // Retrieve projects matching the specified sector
            const matchingProjects = projects.filter(project => {
                // Ensure sector property exists before checking
                if (!project.sector) return false;
                
                // Compare sector name in a case-insensitive manner
                return project.sector.toLowerCase().includes(searchTerm);
            });
            
            // Return results if found
            if (matchingProjects.length > 0) {
                resolve(matchingProjects);
            } else {
                reject(`No projects found for the sector: ${sector}`);
            }

        } catch (err) {
            reject(`Error retrieving projects by sector: ${err}`);
        }
    });
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};

// Execution block for testing purposes
if (require.main === module) {
    console.log('Running project module tests...\n');

    // Execute initialization
    initialize()
        .then(() => {
            console.log('Initialization completed successfully!');
            
            // Fetch all projects
            return getAllProjects();
        })
        .then(allProjects => {
            console.log('\nTesting getAllProjects:');
            console.log(`Total projects available: ${allProjects.length}`);
            
            // Fetch a project by ID 9
            return getProjectById(9);
        })
        .then(project => {
            console.log('\nTesting getProjectById (ID: 9):');
            console.log(project);
            
            // Fetch projects under the "agriculture" sector
            return getProjectsBySector('agriculture');
        })
        .then(sectorProjects => {
            console.log('\nTesting getProjectsBySector (sector: agriculture):');
            console.log(`Total projects found: ${sectorProjects.length}`);
            sectorProjects.forEach(project => {
                console.log(`- ${project.id}: ${project.sector}`);
            });
        })
        .catch(err => {
            console.error('\nAn error occurred while testing:', err);
        })
        .finally(() => {
            console.log('\nTesting concluded.');
        });
}
=======
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
>>>>>>> master
