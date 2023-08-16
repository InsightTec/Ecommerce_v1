const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Country = require("../../models/countryModel");
//const Governorate = require("../../models/governorateModel");

exports.createGovernorateValidator = [
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
  check("country")
    .notEmpty()
    .withMessage("Governorate must be belong to a country")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((countryId) =>
      Country.findById(countryId).then((country) => {
        if (!country) {
          return Promise.reject(
            new Error(`No Country for this id: ${countryId}`)
          );
        }
      })
    ),
    (req, res,next) => {
      // Handle the request
      req.about='Create a Governorate';
      next();
    },

  validatorMiddleware,
];

exports.getGovernorateValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Governorate';
    next();
  },
  validatorMiddleware,
];

exports.updateGovernorateValidator = [
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
    req.about='Update a Governorate';
    next();
  },

  validatorMiddleware,
];

exports.deleteGovernorateValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Governorate';
    next();
  },
  validatorMiddleware,
];
