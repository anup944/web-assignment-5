require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING);

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sector_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

// Define Project model
const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  feature_img_url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  summary_short: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  intro_short: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  impact: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  original_source_url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sector_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// Set up association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => resolve())
      .catch(err => reject(`Unable to sync database: ${err}`));
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    Project.findAll({ include: [Sector] })
      .then(projects => resolve(projects))
      .catch(err => reject("Projects not initialized or empty"));
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    Project.findAll({ 
      where: { id: projectId },
      include: [Sector]
    })
      .then(projects => {
        if (projects.length > 0) {
          resolve(projects[0]);
        } else {
          reject(`Unable to find requested project with id: ${projectId}`);
        }
      })
      .catch(err => reject(`Unable to find requested project with id: ${projectId}`));
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': { [Sequelize.Op.iLike]: `%${sector}%` }
      }
    })
      .then(projects => {
        if (projects.length > 0) {
          resolve(projects);
        } else {
          reject(`Unable to find requested projects for sector: ${sector}`);
        }
      })
      .catch(err => reject(`Unable to find requested projects for sector: ${sector}`));
  });
}

function getAllSectors() {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then(sectors => resolve(sectors))
      .catch(err => reject("Unable to fetch sectors"));
  });
}

function addProject(projectData) {
  return new Promise((resolve, reject) => {
    Project.create(projectData)
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
    Project.update(projectData, { where: { id: id } })
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

function deleteProject(id) {
  return new Promise((resolve, reject) => {
    Project.destroy({ where: { id: id } })
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

module.exports = { 
  initialize, 
  getAllProjects, 
  getProjectById, 
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};