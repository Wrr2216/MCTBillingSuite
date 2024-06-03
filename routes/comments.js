const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');

// Create a new comment
router.post('/:projectId/comments', async (req, res) => {
  try {
    const commentData = {
      projectId: req.params.projectId,
      user: req.user.username,
      text: req.body.text
    };
    const newComment = await Comment.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Get comments by project ID
router.get('/:projectId/comments', async (req, res) => {
  try {
    const comments = await Comment.findCommentsByProjectId(req.params.projectId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

module.exports = router;
