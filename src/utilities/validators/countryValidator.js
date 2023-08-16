const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");


exports.createCountryValidator = [
  check("nameEn")
    .notEmpty()
    .withMessage("name in English required")
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("nameAr")
    .notEmpty()
    .withMessage("name in Arabic required")
    .isLength({ min: 3 })
    .withMessage("Too short  name")
  ,
  (req, res,next) => {
    // Handle the request
    req.about='Create a Country';
    next();
  },

  validatorMiddleware,
];

exports.getCountryValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Country';
    next();
  },
  validatorMiddleware,
];

exports.updateCountryValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  body("nameEn")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
   ,
   (req, res,next) => {
    // Handle the request
    req.about='Update a Country';
    next();
  },

  validatorMiddleware,
];

exports.deleteCountryValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Country';
    next();
  },
  validatorMiddleware,
];
