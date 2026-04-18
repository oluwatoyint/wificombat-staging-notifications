import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

import { failedResponse } from "./http";

export const verifyJwtToken = (token:string): any =>{
    try {
        const decode = jwt.verify(token, `${process.env.SECRET_KEY}`)
        return decode
    } catch (error) {
        throw new Error("Invalid token")
        
    }
}

export const IsAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return failedResponse(res, 401, 'Access denied. Authorization header missing.');
    }
  
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
    if (!token) {
      return failedResponse(res, 401, 'Access denied. No token provided.');
    }
  
    try {
      const decodedToken = verifyJwtToken(token);
  
      (req as any).user = {
        email: decodedToken.email,
        _id: decodedToken.user_id,
        role: decodedToken.role
      };
      next();
    } catch (error: any) {
      return failedResponse(res, 401, 'Invalid access token.');
    }
  };