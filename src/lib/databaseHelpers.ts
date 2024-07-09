import { getConnection } from "../server";
import { hashPassword } from "./utils";
import { ResultSetHeader } from "mysql2/promise";

export async function createUser(username: string, password: string) {
  const connection = await getConnection();
  const hashedPassword = await hashPassword(password);
  const [results]: [ResultSetHeader, unknown] = await connection.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    hashedPassword,
  ]);
  return results;
}

export async function createTask(title: string, description: string, userId: number) {
  const connection = await getConnection();
  const [results]: [ResultSetHeader, unknown] = await connection.execute("INSERT INTO tasks (title, description, userId) VALUES (?, ?, ?)", [
    title,
    description,
    userId,
  ]);
  return results;
}

export async function getTasksOfUser(userId: number, limit?: number, offset?: number): Promise<Task[]> {
  const connection = await getConnection();

  const bindingValues: (number | string)[] = [userId];
  let query = `SELECT * FROM tasks WHERE userId = ?`;

  if (limit !== undefined) {
    query += ` LIMIT ?`;
    bindingValues.push(`${limit}`);
  }

  if (offset !== undefined) {
    query += ` OFFSET ?`;
    bindingValues.push(`${offset}`);
  }

  console.log(bindingValues);
  console.log(query);

  const [results]: [Task[], unknown] = await connection.execute(query, bindingValues);
  return results;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const connection = await getConnection();
  const [results]: [User[], unknown] = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);
  return results.length > 0 ? results[0] : undefined;
}

export async function updateTask(taskId: number, { title, description }: { title: string | undefined; description: string | undefined }) {
  const connection = await getConnection();
  const updateFields: string[] = [];
  const updatedFieldsValue: (string | number)[] = [];

  if (title) {
    updateFields.push("title = ?");
    updatedFieldsValue.push(title);
  }

  if (description) {
    updateFields.push("description = ?");
    updatedFieldsValue.push(description);
  }

  const query = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;
  updatedFieldsValue.push(taskId);

  const [results]: [ResultSetHeader, unknown] = await connection.execute(query, updatedFieldsValue);
  return results;
}

export async function deleteTask(taskId: number) {
  const connection = await getConnection();

  const [results]: [ResultSetHeader, unknown] = await connection.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
  return results;
}

export async function getTask(taskId: number) {
  const connection = await getConnection();
  const [results]: [Task[], unknown] = await connection.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);
  return results.length > 0 ? results[0] : undefined;
}
