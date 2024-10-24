import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";

import {
  loginValidation,
  registerValidation,
  updateValidation,
} from "../validations/userValidation";

const router = Router();

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post(
  "/update-user",
  updateValidation,
  validateRequest,
  authMiddleware,
  updateUser
);

export default router;
