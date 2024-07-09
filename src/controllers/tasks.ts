import AppError from "../lib/appError";
import { createTask, deleteTask, getTask, getTasksOfUser, updateTask } from "../lib/databaseHelpers";
import { catchAsyncError, generateErrorMessageFromZod, validateTask } from "../lib/utils";

const TASKS_PER_PAGE = 10;

export const getTasksForLoggedInUser = catchAsyncError(async (req, res, _) => {
  const userId = req.session.userId as number;

  const page = Number(req.query.page || 1);

  let tasks = await getTasksOfUser(userId);

  const totalTasks = tasks.length;

  let totalPages = 0;

  if (totalTasks) {
    totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);
    const offset = (page - 1) * TASKS_PER_PAGE;
    tasks = await getTasksOfUser(userId, TASKS_PER_PAGE, offset);
  }

  res.json({
    status: "success",
    data: {
      tasks,
    },
    pagination: {
      page: page,
      totalPages,
      totalTasks,
    },
  });
});

export const createTaskForLoggedInUser = catchAsyncError(async (req, res, next) => {
  const task: TaskPayload = req.body;

  const results = validateTask(task);
  if (results.error) {
    return next(new AppError(generateErrorMessageFromZod(results.error), 400));
  }

  await createTask(task.title, task.description, req.session.userId!);

  res.status(201).json({
    status: "success",
  });
});

export const getTaskForLoggedInUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await getTask(Number(id));
  if (!task) {
    return next(new AppError("No task with this id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const deleteTaskForLoggedInUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await getTask(Number(id));
  if (!task) {
    return next(new AppError("No task with this id", 404));
  }
  await deleteTask(Number(id));
  console.log(id);
  res.status(200).json({
    status: "success",
  });
});

export const updateTaskForLoggedInUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    return next(new AppError("You need to specify field to update", 400));
  }

  const task = await getTask(Number(id));
  if (!task) {
    return next(new AppError("No task with this id", 404));
  }

  await updateTask(Number(id), { title, description });

  res.status(200).json({
    status: "success",
  });
});
