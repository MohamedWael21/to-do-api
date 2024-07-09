import AppError from "../lib/appError";
import { createUser, getUserByUsername } from "../lib/databaseHelpers";
import { catchAsyncError, generateErrorMessageFromZod, validateUser } from "../lib/utils";
import { comparePassword } from "../lib/utils";

export const login = catchAsyncError(async (req, res, next) => {
  const { username, password }: UserPayload = req.body;

  if (!username || !password) {
    return next(new AppError("Username or password is missing", 400));
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return next(new AppError("Invalid username or password", 401));
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid username or password", 401));
  }

  // Save user information in the session
  req.session.userId = user.id;

  res.json({
    status: "success",
    data: {
      user: {
        id: user.id,
        username: user.username,
      },
    },
  });
});

export const signup = catchAsyncError(async (req, res, next) => {
  const { username, password }: UserPayload = req.body;

  const results = validateUser({ username, password });

  if (!results.success) {
    return next(new AppError(generateErrorMessageFromZod(results.error), 400));
  }

  const { insertId } = await createUser(username, password);

  // Save user information in the session
  req.session.userId = insertId;

  res.status(201).json({
    status: "success",
  });
});
