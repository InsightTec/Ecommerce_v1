const asyncHandler = require("express-async-handler");
const ApiError = require("../utilities/apiError");
const ApiFeatures = require("../utilities/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      // res.status(404).json({message:`No brand for this id :${id}`});
      return next(new ApiError(`No document for this id :${id}`, 404));
    }
    // Trigger "remove" event when update document
    document.remove();

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { name } = req.body;
console.log('jjjj',JSON.stringify(req.body))
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // new to return brand after update);
    if (!document) {
      return next(new ApiError(`No result for this document`, 404));
    }
    // Trigger "save" event when update document to calcutate ratingsAverage
    document.save();

    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    console.log('here',req.body)
    const document = await Model.create(req.body);
    res.status(201).send(document);
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
   console.log('hereeeeeeeeee')
    const { id } = req.params;
    // 1) Build query here not use await to build
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query , here use await for execute
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modeName = "") =>
  asyncHandler(async (req, res) => {
    // for nested routes in subCategories
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

 console.log('filterObj='+JSON.stringify(req.filterObj))
    // get total number of brands
    const documentsCounts = await Model.countDocuments(filter);

    //Build query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modeName)
      .limitFields()
      .sort();

    //execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    // const products = await apiFeatures.mongooseQuery;

    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
