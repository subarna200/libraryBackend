import { Router } from "express";
import {
  getMyInfo,
  processLogin,
  userPassAvatarChange,
  userProfilePicUpdate,
} from "../Controller/user.controller";
import { AuthenticateUser } from "../Middlewares/Authorization.middleware";
import { upload } from "../Middlewares/multer.middleware";
import {
  getDashboardInfo,
  getStudentDashboardInfo,
  makesPenalty,
} from "../Controller/bookTransaction.controller";

const router = Router();

router.post("/login", processLogin);
router.get("/me", getMyInfo);
router.post(
  "/user/edit/password",
  AuthenticateUser,
  upload.single("photo"),
  userPassAvatarChange
);
router.post(
  "/user/profile/update",
  AuthenticateUser,
  upload.single("photo"),
  userProfilePicUpdate
);
router.get("/getDashboardInfo", AuthenticateUser, getDashboardInfo);
router.post(
  "/getStudentDashboardInfo",
  AuthenticateUser,
  getStudentDashboardInfo
);

router.get("/makespenalty", makesPenalty);

export default router;
