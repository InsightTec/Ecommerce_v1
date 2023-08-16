const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Category = require("../../../models/categoryModel");
const subCategory = require("../../../models/subCategoryModel");


// connect to DB
dbConnection();

exports.insertsubCategorySeeder =  asyncHandler(async () => {

    await this.destroysubCategorySeeder();

    console.log('---------Start insert subCategory seeder'.green.inverse);
    const categoryData =  await Category.find();
   // console.log(categoryData);

    await Promise.all(
        categoryData.map(async(item)=>{

       for(let i=1;i<=5;i++){
        await subCategory.create({
        
    //  _id:new ObjectId(item._id),
          name: `${item.name}-subCategory-${i}`,
          category:item._id,
          slug: `${item.name}-subCategory-${i}`,

        
          rank: i*10,
          active: true
        

      });
       }

      
    })
    )
      

    console.log('---------End insert subCategory seeder'.green.inverse);
});

exports.destroysubCategorySeeder =  asyncHandler(async () => {

    console.log('---------start  destroy subCategory seeder'.red.inverse);
   
     await subCategory.deleteMany();
      
    console.log('---------end destroy subCategory seeder'.red.inverse);
});

this.insertsubCategorySeeder();