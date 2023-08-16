const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Region = require("../../../models/regionModel");
const Hand = require("../../../models/handModel");


// connect to DB
dbConnection();

exports.insertHandSeeder =  asyncHandler(async () => {

    await this.destroyHandSeeder();

    console.log('---------Start insert Hand seeder'.green.inverse);
    //const regionsData =  JSON.parse(fs.readFileSync("./region.json"));

     //
     const regionsData=await Region.find({});


    await Promise.all(
      regionsData.map(async(item,index)=>{
        for(let i=1;i<=5;i++)
        {
            await Hand.create({
          // _id:new ObjectId(item._id),
            name: `Hand-${i}-${item.name}`,
            slug: `Hand-${i}-${item.name}`,
            code: '',
            region:item._id,
            regionCode:item.code,
            rank: i*10,
            active: true
          

        });
        console.log(`inseted Hand : Hand-${i}-${item.name}`)
        }
    
    })
    )
      

    console.log('---------End insert Hand seeder'.green.inverse);
});

exports.destroyHandSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Hand seeder'.red.inverse);
   
      await Hand.deleteMany();
      
    console.log('---------end destroy Hand seeder'.red.inverse);
});

this.insertHandSeeder();