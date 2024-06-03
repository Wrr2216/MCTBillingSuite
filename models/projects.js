const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const LogManager = require('../LogManager');
const log = new LogManager(config);
const sequelize = require('../database');

const Project = sequelize.define('Projects', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  clientPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  projectedEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'ongoing', 'completed'),
    defaultValue: 'pending'
  },
  estimatedCost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  actualCost: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  estimatedRevenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  actualRevenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  hoursWorked: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  hourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  projectRate: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  hooks: {
    beforeDestroy: async (project) => {
      await sequelize.models.Comment.destroy({
        where: {
          projectId: project.id
        }
      });
    }
  }
});

Project.associate = (models) => {
  Project.hasMany(models.Comment, {
    onDelete: 'CASCADE', // Add this line to enable cascading delete
  });
};


// Static methods for Project operations
Project.createProject = async function(projectData) {
  try {
    const newProject = await Project.create(projectData);
    log.info('Project created successfully:', newProject.toJSON());
    return newProject;
  } catch (error) {
    log.error('Error creating project:', error);
    throw error;
  }
}

Project.findProjectById = async function(projectId) {
  try {
    const project = await Project.findByPk(projectId);
    if (project !== null) {
      log.info('Project found:', project.toJSON());
      return project;
    } else {
      log.info('Project not found');
      return null;
    }
  } catch (error) {
    log.error('Error finding project by ID:', error);
    throw error;
  }
}

Project.updateProject = async function(projectId, updatedData) {
  try {
    const project = await Project.findByPk(projectId);
    if (project !== null) {
      await project.update(updatedData);
      log.info('Project updated successfully:', project.toJSON());
      return project;
    } else {
      log.info('Project not found');
      return null;
    }
  } catch (error) {
    log.error('Error updating project:', error);
    throw error;
  }
}

Project.deleteProject = async function(projectId) {
  try {
    const project = await Project.findByPk(projectId);
    if (project !== null) {
      await project.destroy();
      log.info('Project deleted successfully');
      return true;
    } else {
      log.info('Project not found');
      return false;
    }
  } catch (error) {
    log.error('Error deleting project:', error);
    throw error;
  }
}

module.exports = Project;
