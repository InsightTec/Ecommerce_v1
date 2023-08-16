const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Company = require("../../../models/companyModel");
const User = require("../../../models/userModel");


// connect to DB
dbConnection();

exports.insertUserSeeder =  asyncHandler(async () => {

    await this.destroyUserSeeder();

    console.log('---------Start insert User seeder'.green.inverse);
    const companyData =  await Company.find();

    console.log('companyData=', companyData);

   // 1 create user for each company in role 'user'
    await Promise.all(

        
        companyData.map(async(item)=>{

        await User.create({
        
    //  _id:new ObjectId(item._id),
          name: `${item.name}-user`,
          company:item._id,
          slug: `${item.name}-user`,
          email:`${item.name}-user@gmail.com`,
          phone:'123456789',
          profileImg:"company.jpg",
          password:"123456789",
        
          language:"english",
          role:"company",
          rank:50,
          active:true
      });  
    })

 )
 // 2 create users for for roles : superAdmin,admin,user
 const userData =   JSON.parse(fs.readFileSync("./users.json"));

   

    await Promise.all(

       
       userData.map(async(item)=>{

       await User.create({
       
   //  _id:new ObjectId(item._id),
         name: item.name,
         slug: item.slug,
         email:item.email,
         phone:item.phone,
         profileImg:item.profileImg,
         password:item.password,
         language:item.language,
         role:item.role,
         addresses:item.addresses,
         locations:item.locations,
         rank:item.rank,
         active:item.active
     });  
   })
// 2 create users for for roles : superAdmin,admin,user




   )
      

    console.log('---------End insert user seeder'.green.inverse);
});

exports.destroyUserSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy user seeder'.red.inverse);
   
     await User.deleteMany();
      
    console.log('---------end destroy user seeder'.red.inverse);
});

this.insertUserSeeder();