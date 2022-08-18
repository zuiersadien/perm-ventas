const { Router } = require("express");
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  Detalles
} = require("../controllers/tasks.controller");

const router = Router();

// create a task
router.post("/tasks", createTask);

router.get("/tasks", getAllTasks);
router.get("/tasks/detalles", Detalles);
router.get("/tasks/:id", getTask);

router.put("/tasks/:id", updateTask);

router.delete("/tasks/:id", deleteTask);

module.exports = router;
