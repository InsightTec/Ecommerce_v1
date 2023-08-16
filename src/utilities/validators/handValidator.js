const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Region = require("../../models/regionModel");


exports.createHandValidator = [
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
  check("region")
    .notEmpty()
    .withMessage("Region id must be belong to a Region")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((regionId) =>
      Region.findById(regionId).then((region) => {
        if (!region) {
          return Promise.reject(
            new Error(`No Region for this id: ${regionId}`)
          );
        }
      })
    ),
    (req, res,next) => {
      // Handle the request
      req.about='Create a Hand';
      next();
    },

  validatorMiddleware,
];

exports.getHandValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Hand';
    next();
  },
  validatorMiddleware,
];

exports.updateHandValidator = [
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
    req.about='Update a Hand';
    next();
  },

  validatorMiddleware,
];

exports.deleteHandValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Hand';
    next();
  },
  validatorMiddleware,
];
