const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Permission = require('../../models/permissionModel');

exports.createRoleValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('permissions')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID format')
    .custom((permissionsIds) =>
    Permission.find({ _id: { $exists: true, $in: permissionsIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== permissionsIds.length) {
            return Promise.reject(new Error(`Invalid permission Ids`));
          }
        }
      )
    )
  ,
  (req, res,next) => {
    // Handle the request
    req.about='Create a Role ';
    next();
  },

  validatorMiddleware,
];

exports.getRoleValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Role ';
    next();
  },
  validatorMiddleware,
];

exports.updateRoleValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
   ,
   (req, res,next) => {
    // Handle the request
    req.about='Update a Role ';
    next();
  },

  validatorMiddleware,
];

exports.deleteRoleValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Role ';
    next();
  },
  validatorMiddleware,
];
