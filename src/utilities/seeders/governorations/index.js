const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Country = require("../../../models/countryModel");
const Governorate = require("../../../models/governorateModel");


// connect to DB
dbConnection();

exports.insertGovernorateSeeder =  asyncHandler(async () => {

    await this.destroyGovernorateSeeder();

    console.log('---------Start insert Governorate seeder'.green.inverse);
    const governorateData =  JSON.parse(fs.readFileSync("./governorate.json"));

     // get country id 
     const country=await Country.find({});
     const country_id=country[0]._id;
     const countryCode=country[0].code;

    await Promise.all(
        governorateData.map(async(item)=>{
      await Governorate.create({
        
          _id:new ObjectId(item._id),
          name: item.name,
          slug: item.slug,
          code: item.code,
          country:country_id,
          countryCode:countryCode,
          rank: item.rank,
          active: item.active
        

      });
      console.log(`inseted Governorate : ${item.name}`)
    })
    )
      

    console.log('---------End insert Governorate seeder'.green.inverse);
});

exports.destroyGovernorateSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Governorate seeder'.red.inverse);
   
      await Governorate.deleteMany();
      
    console.log('---------end destroy Governorate seeder'.red.inverse);
});

this.insertGovernorateSeeder();