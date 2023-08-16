const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Country = require("../../../models/countryModel");


// connect to DB
dbConnection();

exports.insertCountrySeeder =  asyncHandler(async () => {

    await this.destroyCountrySeeder();

    console.log('---------Start insert country seeder'.green.inverse);
    const countryData =  JSON.parse(fs.readFileSync("./country.json"));
    await Promise.all(
    countryData.map(async(item)=>{
      await Country.create({
        
          _id:new ObjectId(item._id),
          name: item.name,
          slug: item.slug,
          code: item.code,
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert country seeder'.green.inverse);
});

exports.destroyCountrySeeder =  asyncHandler(async () => {

    console.log('---------start  destroy country seeder'.red.inverse);
   
      await Country.deleteMany();
      
    console.log('---------end destroy country seeder'.red.inverse);
});

this.insertCountrySeeder();