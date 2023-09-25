const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Unit = require("../../../models/unitModel");


// connect to DB
dbConnection();

exports.insertUnitSeeder =  asyncHandler(async () => {

    await this.destroyUnitSeeder();

    console.log('---------Start insert Unit seeder'.green.inverse);
    const unitData =  JSON.parse(fs.readFileSync("./unit.json"));
    console.log(unitData);

    await Promise.all(
        unitData.map(async(item)=>{

       

      await Unit.create({
        
      _id:new ObjectId(item._id),
          name: item.name,
          nameTr: item.nameTr,
          nameAr: item.nameAr,
         
          slug: item.slug, 
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert Unit seeder'.green.inverse);
});

exports.destroyUnitSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Unit seeder'.red.inverse);
   
      await Unit.deleteMany();
      
    console.log('---------end destroy Unit seeder'.red.inverse);
});

this.insertUnitSeeder();