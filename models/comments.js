const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const LogManager = require('../LogManager');
const log = new LogManager(config);

// Extract database configuration from the config object
const { host, user, password, database } = config.database;

const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host
});

const Comment = sequelize.define('Comments', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Static methods for Comment operations
Comment.createComment = async function(projectId, user, text, date) {
  try {
    const newComment = await Comment.create({ projectId, user, text, date });
    log.info('Comment created successfully:', newComment.toJSON());
    return newComment;
  } catch (error) {
    log.error('Error creating comment:', error);
    throw error;
  }
}

Comment.findCommentsByProjectId = async function(projectId) {
  try {
    const comments = await Comment.findAll({ where: { projectId } });
    return comments;
  } catch (error) {
    log.error('Error finding comments by project ID:', error);
    throw error;
  }
}

module.exports = Comment;
