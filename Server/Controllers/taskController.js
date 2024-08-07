const task = require("../Models/TasksModel.js");
const profile = require("../Models/ProfileModel.js");

// Create Task
const createTask = async (req, res) => {
  let userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log(req.body);
    const newTask = new task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      userId: userId,
      profile: req.body.profile,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(deletedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Task
const getTask = async (req, res) => {
  try {
    const task = await task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Tasks
const getTasks = async (req, res) => {
  console.log(req.params);
  try {
    const tasks = await task.find({ profile: req.params.profileId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Get Profiles
const getProfiles = async (req, res) => {
  let userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not found" });
  }
  try {
    const profiles = await profile.find({ userId: userId });
    res.json(profiles);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getTask,
  getTasks,
  getProfiles
};