class ApiFeatures {
    constructor(mongooseQuery, queryString) {
      this.mongooseQuery = mongooseQuery;
      this.queryString = queryString;
    }
  
    filter() {
      //1) filtering
      //ex: http://localhost:4000/api/v1/products?ratingsAverage=4.4
      // to take a copy of req.query not reference in(const queryStringObject=req.query;)
      const queryStringObject = { ...this.queryString };
      const excludesFields = ["page", "limit", "sort", "fields"];
      excludesFields.forEach((field) => delete queryStringObject[field]);
      //console.log(req.query);
      //console.log(queryStringObject);
  
      //ex: http://localhost:4000/api/v1/products?ratingsAverage[lte]=4.4
      //applay filtering using [gte,gt,lte,lt]
      //object in mongo : {price:{$gte:4},ratingsAverage:{$gte:200}} means greater than or equal
      //object in mongo : {price:{$lte:4},ratingsAverage:{$lte:200}} means less than or equal
      //parameter in postman :  ratingsAverage[gte] result of it : {price:{gte:4},ratingsAverage:{gte:200}}
      // so we replace gte with $gte and for others
      //  JSON.stringify : convert object to string, convert string to object : JSON.parse()
      let queryStr = JSON.stringify(queryStringObject);
      // reqular expression if there is exactly use :(\b   \b) gte,gt,lte,lt   then use :   g means if more than one value
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
      // return the object to use another method
      return this;
    }
    active(accountRole=null) {
   
      let filter={};

      // check if user logged
        if(accountRole){
          if(accountRole ==='user'){
            filter.active =true
      //    filter.deletedAt =  { $in: [null, undefined] }
      //  filter.deletedAt =   { $ne: null }
          }
        }
        // for not logged users 
        else{
          filter.active =true
        //  filter.deletedAt =  { $in: [null, undefined] }
        }

  
      this.mongooseQuery = this.mongooseQuery.find(filter);
      // return the object to use another method
      return this;
    }
    delete(accountRole=null) {
   
      let filter={};

      // check if user logged
        if(accountRole){
          if(accountRole ==='user'){
          //  filter.active =true
          filter.deletedAt =  { $in: [null, undefined] }
      //  filter.deletedAt =   { $ne: null }
          }
        }
        // for not logged users 
        else{
         // filter.active =true
          filter.deletedAt =  { $in: [null, undefined] }
        }

  
      this.mongooseQuery = this.mongooseQuery.find(filter);
      // return the object to use another method
      return this;
    }
  
    sort() {
      //3) sorting
      // ex: http://localhost:4000/api/v1/products?sort=-price,sold
      // for ASE sort use in query string ex: sort=price , for many sort : sort=price,sold
      // for DESC sort use in query string ex: sort=-price, for many sort : sort=price,-sold
      if (this.queryString.sort) {
        // in mongo for many sort use  mongoose.sort('price sold')
        // split query by comma   ex : price,sold => [price,sold]
        // join by comma ex:  [price,sold] => price sold
        const sortBy = this.queryString.sort.split(",").join(" ");
  
       
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
      } else {
        // if not there is query string sort then sort by recent products  createAt DESC
        this.mongooseQuery = this.mongooseQuery.sort({createdAt:-1, updatedAt:-1 });
      }
      // return the object to use another method
      return this;
    }
  
    limitFields() {
      //4) fields limiting
      // return only title,image,price ex:  http://localhost:4000/api/v1/products?fields=title,image,price
      // return all except price ex:  http://localhost:4000/api/v1/products?fields=-price
      if (this.queryString.fields) {
        // in mongo for specific select use  mongoose.select(' titleprice')
        // split query by comma   ex :title, price => [title, price]
        // join by comma ex:  [title,price] => title price
        const fields = this.queryString.fields.split(",").join(" ");
        this.mongooseQuery = this.mongooseQuery.select(fields);
      } else {
        // all fields except __v with return from mongoose
        this.mongooseQuery = this.mongooseQuery.select("-__v");
      }
      // return the object to use another method
      return this;
    }
  
    search(modelName) {
      // 5) search
      if (this.queryString.keyword) {
        let query = {};
        if (modelName === "user") {
          query.$or = [
            // use option i to make car ==Car==CAR same thing
            { name: { $regex: this.queryString.keyword, $options: "i" } },
            { email: { $regex: this.queryString.keyword, $options: "i" } },
          ];
        } else {
          query.$or = [
            { name: { $regex: this.queryString.keyword, $options: "i" }},
            // { nameAr: { $regex: this.queryString.keyword, $options: "i" }},
            // { nameTr: { $regex: this.queryString.keyword, $options: "i" }},
          ];
        }
  
        this.mongooseQuery = this.mongooseQuery.find(query);
      }
      // return the object to use another method
      return this;
    }
  
    paginate(countDocuments) {
      //2) paggination
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 50;
      const skip = (page - 1) * limit;
      const endIndex = page * limit;
  
      // pagination result;
      let pagination = {};
  
      pagination.currentPage = page;
      pagination.limit = limit;
      pagination.numberOfPages = Math.ceil(countDocuments / limit);
      //next page
      if (endIndex < countDocuments) {
        pagination.next = page + 1;
      }
      if (skip > 0) {
        pagination.prev = page - 1;
      }
      this.mongooseQuery.skip(skip).limit(limit);
      this.paginationResult = pagination;
      return this;
    }
  }
  
  module.exports = ApiFeatures;
  