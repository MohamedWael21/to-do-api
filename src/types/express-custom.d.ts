import { Request, Response, NextFunction } from "express";

declare global {
  type ExpressRequest = Request;
  type ExpressResponse = Response;
  type ExpressNextFunction = NextFunction;
}
