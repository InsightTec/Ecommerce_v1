const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createCompanyValidator = [

  body("name")
    .notEmpty()
    .withMessage("name in  required")
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .custom((val, { req }) => {
      if (!val || val.trim() === '') {
        throw new Error('Name is required');
      }
      req.body.slug = slugify(val);
      return true;
    }),
 
    (req, res,next) => {
      // Handle the request
      req.about='Create a Company ';
      next();
    },
  validatorMiddleware,
];

exports.getCompanyValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Get a Company ';
    next();
  },
  validatorMiddleware,
];

exports.updateCompanyValidator = [
  (req, res,next) => {
    console.log('req='+JSON.stringify(req.body))
    next();
  },
  check("id").isMongoId().withMessage("Invalid  id format"),
  check("name")
  .optional()
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

exports.deleteCompanyValidator = [
  check("id").isMongoId().withMessage("Invalid  id format"),
  (req, res,next) => {
    // Handle the request
    req.about='Delete a Company ';
    next();
  },
  validatorMiddleware,
];
