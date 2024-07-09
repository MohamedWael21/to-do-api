import AppError from "./appError";

export default function (err: AppError, req: ExpressRequest, res: ExpressResponse, _: ExpressNextFunction) {
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    status: "error",
    error: {
      message: err.message,
    },
  });
}
