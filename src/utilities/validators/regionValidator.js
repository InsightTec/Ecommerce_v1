const slugify = require("slugify");
const { check, body } = require("express-validator");


const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Governorate = require("../../models/governorateModel");

exports.createRegionValidator = [
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
  check("governorate")
    .notEmpty()
    .withMessage("Governorate id  must be belong to a governorate")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((governorateId) =>
    Governorate.findById(governorateId).then((governorate) => {
        if (!governorate) {
          return Promise.reject(
            new Error(`No governorate for this id: ${governorateId}`)
          );
        }
      })
    ),
    (req, res,next) => {
      // Handle the request
      req.about='Create a Region ';
      next();
    },

  validatorMiddleware,
];

exports.getRegionValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Region ';
    next();
  },
  validatorMiddleware,
];

exports.updateRegionValidator = [
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
    req.about='Update a Region ';
    next();
  },

  validatorMiddleware,
];

exports.deleteRegionValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Region ';
    next();
  },
  validatorMiddleware,
];
