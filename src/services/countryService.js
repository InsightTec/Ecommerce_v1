
const factory = require("./handlersFactory");


const countryModel = require("../models/countryModel");


// @des get all countries
// @route  GET api/v1/countries
// @access private
exports.getCountries = factory.getAll(countryModel);


// @des get  country by id
// @route  GET api/v1/countries/:id
// @access public
exports.getCountry = factory.getOne(countryModel);

// @des create new country
// @route  POST api/v1/countries
// @access private
exports.createCountry = factory.createOne(countryModel);

// @des post  update country
// @route  POST api/v1/countries/:id
// @access private
exports.updateCountry = factory.updateOne(countryModel);


// @des delete  delete country
// @route  DELETE api/v1/countries/:id
// @access private
exports.deleteCountry = factory.deleteOne(countryModel);
