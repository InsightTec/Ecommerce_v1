const express = require("express");

const router = express.Router();

const {
  getRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
} = require("../services/roleService");

const {
  getRoleValidator,
  createRoleValidator,
  updateRoleValidator,
  deleteRoleValidator,
} = require("../utilities/validators/roleValidator");

const authService = require("../services/authService");


router
  .route("/")
  .get(
    authService.protect,
    authService.allowedToPermission("read-roles"),
    getRoles)
  .post(
    authService.protect,
    authService.allowedToPermission("create-roles"),
   createRoleValidator,
    createRole
  );


router
  .route("/:id")
  // param 1 rule, param 2 middleware ,param 3 service
  .get(
    authService.protect,
    authService.allowedToPermission("read-roles"),
    getRoleValidator,
     getRole)
  .put(
    authService.protect,
    authService.allowedToPermission("update-roles"),
    updateRoleValidator,
    updateRole
  )
  .delete(
    authService.protect,
    authService.allowedToPermission("delete-roles"),
    deleteRoleValidator,
    deleteRole
  );

module.exports = router;
