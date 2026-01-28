import { Router } from "express";
import { DeleteCurrentUser, GetCurrentUser, UpdateCurrentUser, UpdateStudentProfile } from "../controllers/user.controller.js";
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRequest } from "../middleware/validation.middleware.js";
import { updateUserSchema } from "../utils/zodSchemas.js";
import upload from "../middleware/upload.middleware.js";

const userRouter = Router();

userRouter.get("/me", authenticateToken, GetCurrentUser);
userRouter.patch('/me', authenticateToken, validateRequest(updateUserSchema), UpdateCurrentUser);
userRouter.delete('/me', authenticateToken, DeleteCurrentUser);
userRouter.put('/profile', authenticateToken, upload.single('profilePicture'), UpdateStudentProfile);

export default userRouter;