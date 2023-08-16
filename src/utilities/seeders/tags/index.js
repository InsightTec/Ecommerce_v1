const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Tag = require("../../../models/tagModel");


// connect to DB
dbConnection();

exports.insertTagSeeder =  asyncHandler(async () => {

    await this.destroyTagSeeder();

    console.log('---------Start insert Tag seeder'.green.inverse);
    const tagData =  JSON.parse(fs.readFileSync("./tag.json"));
    console.log(tagData);

    await Promise.all(
      tagData.map(async(item)=>{

       

      await Tag.create({
        
      _id:new ObjectId(item._id),
          name: item.name,
         
          slug: item.slug,
        
          type:item.type,
        
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert Tag seeder'.green.inverse);
});

exports.destroyTagSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Tag seeder'.red.inverse);
   
      await Tag.deleteMany();
      
    console.log('---------end destroy Tag seeder'.red.inverse);
});

this.insertTagSeeder();