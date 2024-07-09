import express from "express";
import isAuth from "../middleware/auth";
import {
  createTaskForLoggedInUser,
  deleteTaskForLoggedInUser,
  getTaskForLoggedInUser,
  getTasksForLoggedInUser,
  updateTaskForLoggedInUser,
} from "../controllers/tasks";

const router = express.Router();

router.use(isAuth);

router.route("/tasks").get(getTasksForLoggedInUser).post(createTaskForLoggedInUser);
router.route("/tasks/:id").get(getTaskForLoggedInUser).delete(deleteTaskForLoggedInUser).patch(updateTaskForLoggedInUser);

export default router;
