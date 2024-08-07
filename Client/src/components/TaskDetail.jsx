import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const TaskDetailsDialog = ({ open, onClose, task }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Title: {task.title}</Typography>
        <Typography variant="body1">Description: {task.description}</Typography>
        <Typography variant="body1">Status: {task.status}</Typography>
        <Typography variant="body1">Due Date: {new Date(task.dueDate).toLocaleDateString()}</Typography>
        <Typography variant="body1">Priority: {task.priority}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
