import { RowDataPacket } from "mysql2/promise";

declare global {
  declare interface User extends RowDataPacket {
    id: number;
    username: string;
    password: string;
  }

  declare interface Task extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    userId: number;
  }
  declare interface UserPayload {
    username: string;
    password: string;
  }
  declare interface TaskPayload {
    title: string;
    description: string;
  }
  declare type AsyncRequestHandler = (_: ExpressRequest, _: ExpressResponse, _: ExpressNextFunction) => Promise<void>;
}
