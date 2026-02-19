import express from "express";
import userListController from "../../controllers/auth/userList.controller.js";
import checkToken from "../../middleware/checkToken.js";
import userCreatedController from "../../controllers/auth/userCreated.controller.js";
import checkInputan from "../../middleware/checkInputan.js";
import userLoginController from "../../controllers/auth/userLogin.controller.js";
import useLogoutUserController from "../../controllers/auth/useLogoutUser.controller.js";
import useCheckCookieUser from "../../middleware/checkCookieUser.js";
import useEditprofileController from "../../controllers/auth/useEditPorfile.controller.js";
import useDeleteAccountController from "../../controllers/auth/useDeleteAccount.controller.js";
import middlewareCheckBruteForce from "../../middleware/checkBruteForce.js";
import activeteCodeController from "../../controllers/auth/activateCode.controller.js";

const router = express.Router();

router.get("/users/health", (req, res, next) => {
  return res
    .status(200)
    .json({ status: true, message: "users endpoint is alive" });
});

router.get("/users/list", checkToken, userListController);

router.post("/users/created", checkInputan, userCreatedController);

router.post(
  "/users/login",
  // middlewareCheckBruteForce,
  checkInputan,
  userLoginController,
);

router.post("/users/logout", useCheckCookieUser, useLogoutUserController);

router.patch("/users/edit", useCheckCookieUser, useEditprofileController);

router.delete("/users/delete", useCheckCookieUser, useDeleteAccountController);

// activate code token account

router.post("/users/activate-code", useCheckCookieUser, activeteCodeController);

export default router;
