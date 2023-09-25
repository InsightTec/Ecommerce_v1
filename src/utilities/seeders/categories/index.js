const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Category = require("../../../models/categoryModel");


// connect to DB
dbConnection();

exports.insertCategorySeeder =  asyncHandler(async () => {

    await this.destroyCategorySeeder();

    console.log('---------Start insert Category seeder'.green.inverse);
    const categoryData =  JSON.parse(fs.readFileSync("./category.json"));
    console.log(categoryData);

    await Promise.all(
        categoryData.map(async(item)=>{

       

      await Category.create({
        
      _id:new ObjectId(item._id),
          name: item.name,
          nameTr: item.nameTr,
          nameAr: item.nameAr,
         
          slug: item.slug,
        
          image:item.image,
        
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert Category seeder'.green.inverse);
});

exports.destroyCategorySeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Category seeder'.red.inverse);
   
      await Category.deleteMany();
      
    console.log('---------end destroy Category seeder'.red.inverse);
});

this.insertCategorySeeder();