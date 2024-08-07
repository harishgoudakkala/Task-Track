import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import path from './api/path.js';
import api from './api/api.js'; 
import CreateTaskForm from './CreateTaskForm'; 
import EditTaskForm from './EditTaskForm'; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = () => {
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchProfiles();
    if (selectedProfile) {
      fetchTasks();
    }
  }, [selectedProfile]);

  const fetchProfiles = async () => {
    try {
      const response = await api.get(path.getProfiles);
      setProfiles(response.data);
      if (!selectedProfile && response.data.length > 0) {
        setSelectedProfile(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching profiles', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const url = path.getTasks.replace(':profileId', selectedProfile);
      const response = await api.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsEditTaskFormOpen(true);
  };

  const handleView = (task) => {
    setTaskToView(task);
  };

  const handleDelete = async (taskId) => {
    try {
      const url = path.deleteTask.replace(':taskId', taskId);
      await api.delete(url);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    console.log('onDragEnd', result);

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId.replace(/\[|\]/g, '');
    try {
      const url = path.updateTask.replace(':taskId', draggableId);
      await api.put(url, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const Header = ({ onLogout, onChangeProfile }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
      <Typography variant="h6">My App Logo</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="inherit" onClick={onChangeProfile}>
          <AccountCircleIcon />
        </IconButton>
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Box>
    </Box>
  );

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <Card
          sx={{ minHeight: 150, mb: 2, borderRadius: 2, p: 2 }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>{task.title}</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Priority: {task.priority}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" size="small" onClick={() => handleView(task)}>View</Button>
              <Button variant="contained" size="small" onClick={() => handleEdit(task)}>Edit</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(task._id)}>Delete</Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSelect = (profileId) => {
    setSelectedProfile(profileId);
    setAnchorEl(null);
  };

  const handleAddProfile = () => {
    console.log('Add Profile');
  };

  const handleOpenCreateTaskForm = () => {
    setIsCreateTaskFormOpen(true);
  };

  const handleCloseCreateTaskForm = () => {
    setIsCreateTaskFormOpen(false);
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setIsEditTaskFormOpen(false);
  };

  const filteredTasks = tasks.filter(task => task.profile === selectedProfile);

  return (
    <>
      <Header onLogout={handleLogout} onChangeProfile={handleProfileClick} />
      
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
      >
        {profiles.map(profile => (
          <MenuItem key={profile._id} onClick={() => handleProfileSelect(profile._id)}>
            {profile.name}
          </MenuItem>
        ))}
        <MenuItem onClick={handleAddProfile}>Add Profile</MenuItem>
      </Menu>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreateTaskForm}
        sx={{ mt: 2, width: '50%', backgroundColor: 'primary.main', mr: "auto", ml: "auto", maxWidth: 200 }}
      >
        Add Task
      </Button>
      <CreateTaskForm
        open={isCreateTaskFormOpen}
        onClose={handleCloseCreateTaskForm}
        onTaskCreated={handleTaskCreated}
        profileId={selectedProfile}
      />
      
      <EditTaskForm
        open={isEditTaskFormOpen}
        onClose={() => setIsEditTaskFormOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        taskId={taskToEdit ? taskToEdit._id : null}
        task={taskToEdit}
      />

      {taskToView && (
        <Dialog open={Boolean(taskToView)}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Title
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {taskToView.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {taskToView.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Created At
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(taskToView.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Status
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: taskToView.status === 'completed' ? 'success.main' : 'error.main' }}>
                  {taskToView.status.charAt(0).toUpperCase() + taskToView.status.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Priority
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: taskToView.priority === 'high' ? 'error.main' : taskToView.priority === 'medium' ? 'warning.main' : 'text.primary' }}>
                  {taskToView.priority.charAt(0).toUpperCase() + taskToView.priority.slice(1)}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTaskToView(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    <Droppable droppableId="in-progress">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ flex: 1, mr: 2 }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}>
            In Progress
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.filter(task => task.status === 'in-progress').map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>

    <Droppable droppableId="pending">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ flex: 1, mr: 2 }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}>
            Pending
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.filter(task => task.status === 'pending').map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>

    <Droppable droppableId="completed">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ flex: 1, mr: 2 }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}>
            Completed
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.filter(task => task.status === 'completed').map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  </Box>
</DragDropContext>
    </>
  );
};

export default TaskList;
