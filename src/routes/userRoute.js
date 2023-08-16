const express = require("express");

const {
  getUserValidator,
  createUserValidator,
 updateUserValidator,
 deleteUserValidator,
 changeUserPasswordValidator,
 updateLoggedUserValidator,
 changeUserPasswordAdminValidator
} = require("../utilities/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  authMe,
  createFilterRoleObj,
  getUserBySlug,
  changeUserPasswordAdmin
} = require("../services/userService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getUser);
router.get("/auth/me",authMe );
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
//router.use(authService.allowedToPermission("read-users"),);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(createFilterRoleObj,getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    // uploadUserImage,
    //  resizeImage, 
    //  updateUserValidator,
      updateUser)
  .delete(deleteUserValidator, deleteUser);

router.route('/info/:slug').get(getUserBySlug)

module.exports = router;

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.get("/auth/me", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
//router.use(authService.allowedTo("superadmininstrator", "admininstrator","user"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/changePasswordAdmin/:id")
  .put(changeUserPasswordAdminValidator, changeUserPasswordAdmin)

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
