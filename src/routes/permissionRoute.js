const express = require("express");

const router = express.Router();

const {
  getPermissions,
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
} = require("../services/permissionService");

const {
  getPermissionValidator,
  createPermissionValidator,
  updatePermissionValidator,
  deletePermissionValidator,
} = require("../utilities/validators/permissionValidator");

const authService = require("../services/authService");


router
  .route("/")
  .get(
    authService.protect,
    authService.allowedToPermission("read-permissions"),
    getPermissions)
  .post(
    authService.protect,
    authService.allowedToPermission("create-permissions"),
   createPermissionValidator,
    createPermission
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedToPermission("read-permissions"),
    getPermissionValidator, 
    getPermission)
  .put(
    authService.protect,
    authService.allowedToPermission("update-permissions"),
    updatePermissionValidator,
    updatePermission
  )
  .delete(
    authService.protect,
    authService.allowedToPermission("delete-permissions"),
    deletePermissionValidator,
    deletePermission
  );

module.exports = router;
