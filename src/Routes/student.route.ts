import { Router } from "express";
import {
  StudentPassAvatarChange,
  deleteStudent,
  editStudent,
  getAllStudents,
  newPassword,
  newPasswordReq,
  processLogin,
  registerStudent,
  sendOTPPRESET,
  userProfilePicUpdate,
  verifyOTP,
  verifyStudent,
} from "../Controller/student.controller";
import { AuthenticateUser } from "../Middlewares/Authorization.middleware";
import { upload } from "../Middlewares/multer.middleware";

const router = Router();

router.get("/", AuthenticateUser, getAllStudents);
router.post("/register", AuthenticateUser, registerStudent);
router.post("/edit/:id", AuthenticateUser, editStudent);
router.delete("/delete/:id", AuthenticateUser, deleteStudent);
router.post("/verify", verifyStudent);
router.post("/verifyOTP", verifyOTP);
router.post("/newPassword", newPassword);
router.post("/login", processLogin);
router.post("/forgotPassword", sendOTPPRESET);
router.post("/passwordChange", newPasswordReq);
router.post(
  "/settings/password",
  AuthenticateUser,
  upload.single("photo"),
  StudentPassAvatarChange
);
router.post(
  "/profile/update",
  AuthenticateUser,
  upload.single("photo"),
  userProfilePicUpdate
);
export default router;
