const slugify = require("slugify");

const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getOfferValidator = [
  check("id").isMongoId().withMessage("Invalid OfferOffer id"),
  validatorMiddleware,
];

exports.createOfferValidator = [

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

exports.updateOfferValidator = [
  check("id").isMongoId().withMessage("Invalid Offer id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteOfferValidator = [
  check("id").isMongoId().withMessage("Invalid Offer id"),
  validatorMiddleware,
];
