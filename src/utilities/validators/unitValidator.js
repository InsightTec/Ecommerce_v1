const slugify = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getUnitValidator = [
  check("id").isMongoId().withMessage("Invalid Unit id"),
  validatorMiddleware,
];

exports.createUnitValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("minimun length ust be 3 characters")
    .isLength({ max: 32 })
    .withMessage("maximum length ust be 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateUnitValidator = [
  check("id").isMongoId().withMessage("Invalid Unit id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUnitValidator = [
  check("id").isMongoId().withMessage("Invalid Unit id"),
  validatorMiddleware,
];
