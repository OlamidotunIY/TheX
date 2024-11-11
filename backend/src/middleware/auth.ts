import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface CustomRequest extends Request {
 user: mongoose.Document;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.split(" ")[1]
    if (!token) {
      return res.status(401).send({
        error: 'Unauthorized',
        message: 'Please log in'
      });
    }

   const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
        return res.status(401).send({
        error: 'Unauthorized',
        message: 'Session Expired. Please log in'
        });
    }
    const user = await User.findById((decoded as JwtPayload)._id).select('-password');
    if (!user) {
        return res.status(401).send({
        error: 'Unauthorized',
        message: 'User not found'
        });
    }
    (req as CustomRequest).user = user;

   next();
 } catch (err) {
   res.status(401).send({
    status: 401,
    error: 'Unauthorized',
    message: 'Session Expired. Please log in'
   });
 }
};