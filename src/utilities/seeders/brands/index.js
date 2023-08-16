const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Brand = require("../../../models/brandModel");


// connect to DB
dbConnection();

exports.insertBrandSeeder =  asyncHandler(async () => {

    await this.destroyBrandSeeder();

    console.log('---------Start insert Brand seeder'.green.inverse);
    const brandData =  JSON.parse(fs.readFileSync("./brand.json"));
    console.log(brandData);

    await Promise.all(
      brandData.map(async(item)=>{

       

      await Brand.create({
        
      _id:new ObjectId(item._id),
          name: item.name,
         
          slug: item.slug,
        
          image:item.image,
        
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert Brand seeder'.green.inverse);
});

exports.destroyBrandSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Brand seeder'.red.inverse);
   
      await Brand.deleteMany();
      
    console.log('---------end destroy Brand seeder'.red.inverse);
});

this.insertBrandSeeder();