const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");


exports.createPermissionValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    (req, res,next) => {
      // Handle the request
      req.about='Create a Permission ';
      next();
    },

  validatorMiddleware,
];

exports.getPermissionValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Permission ';
    next();
  },
  validatorMiddleware,
];

exports.updatePermissionValidator = [
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
    req.about='Update a Permission ';
    next();
  },

  validatorMiddleware,
];

exports.deletePermissionValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Permission ';
    next();
  },
  validatorMiddleware,
];
