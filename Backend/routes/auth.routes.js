import { Router } from "express";
import { Login, Logout, Register, GoogleLogin, ForgotPassword, ResetPassword, ValidateResetToken } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "../utils/zodSchemas.js";

const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), Register);
authRouter.post('/login', validateRequest(loginSchema), Login);
authRouter.post('/google', GoogleLogin);
authRouter.post('/logout', Logout);
authRouter.post('/forgot-password', ForgotPassword);
authRouter.post('/reset-password', ResetPassword);
authRouter.get('/validate-reset-token', ValidateResetToken);

export default authRouter;


