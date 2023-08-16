const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");


const Governorate = require("../../../models/governorateModel");
const Region = require("../../../models/regionModel");

// connect to DB
dbConnection();

exports.insertRegionSeeder =  asyncHandler(async () => {

    await this.destroyRegionSeeder();

    console.log('---------Start insert Region seeder'.green.inverse);
    //const regionsData =  JSON.parse(fs.readFileSync("./region.json"));

     //
     const governorationsData=await Governorate.find({});


    await Promise.all(
      governorationsData.map(async(item,index)=>{
        for(let i=1;i<=5;i++)
        {
            await Region.create({
          // _id:new ObjectId(item._id),
            name: `Region-${i}-${item.name}`,
            slug: `Region-${i}-${item.name}`,
            code: '',
            governorate:item._id,
            governorateCode:item.code,
            rank: i*10,
            active: true
          

        });
        console.log(`inseted region : Region-${i}-${item.name}`)
        }
    
    })
    )
      

    console.log('---------End insert Region seeder'.green.inverse);
});

exports.destroyRegionSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Region seeder'.red.inverse);
   
      await Region.deleteMany();
      
    console.log('---------end destroy Region seeder'.red.inverse);
});

this.insertRegionSeeder();