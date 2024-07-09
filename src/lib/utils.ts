import bcrypt from "bcrypt";
import { z, ZodError } from "zod";

const userSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const taskSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  description: z.string().min(4, "Description must be at least 4 characters"),
});

export async function hashPassword(password: string) {
  const saltRound = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRound);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export const catchAsyncError = (handleFunc: AsyncRequestHandler) => (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  Promise.resolve(handleFunc(req, res, next)).catch(next);
};

export function validateUser(user: UserPayload) {
  return userSchema.safeParse(user);
}

export function validateTask(task: TaskPayload) {
  return taskSchema.safeParse(task);
}

export function generateErrorMessageFromZod(errors: ZodError) {
  let message = "";
  errors.issues.map((issue) => {
    if (issue.message === "Required") {
      message += issue.path + " ";
    }
    message += issue.message;
    message += "\n";
  });
  return message;
}
