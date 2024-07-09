import AppError from "../lib/appError";
import { catchAsyncError } from "../lib/utils";

const isAuth = catchAsyncError(async (req, _, next) => {
  if (!req.session.userId) {
    return next(new AppError("You need to login", 401));
  }
  next();
});

export default isAuth;
