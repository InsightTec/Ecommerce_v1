const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Company = require("../../../models/companyModel");
const Country=require("../../../models/countryModel");
const Governorate = require("../../../models/governorateModel");
const Region = require("../../../models/regionModel");
const Hand = require("../../../models/handModel");

// connect to DB
dbConnection();

exports.insertCompanySeeder =  asyncHandler(async () => {

    await this.destroyCompanySeeder();

    console.log('---------Start insert Company seeder'.green.inverse);
    const companyData =  JSON.parse(fs.readFileSync("./company.json"));
    const country=await Country.find({code:'TR'});
    const cCountry=country[0]._id;
    console.log('country=',country)
    console.log(companyData);

    await Promise.all(
      companyData.map(async(item)=>{

            // const hand= await Hand.aggregate([ { $sample: { size: 1 } } ]);
            // const cHandId=hand[0]._id;
            // const cHandRegion=hand[0].region;

            // only region 
  
            const region= await Region.aggregate([ { $sample: { size: 1 } } ]);
            const cReigionId=region[0]._id;
            const cRegionGovernorate=region[0].governorate;

            const openStatus=faker.datatype.boolean();

      await Company.create({
        
       _id:new ObjectId(item._id),
          name: item.name,
          description: item.description,
          slug: item.slug,
          email:item.email,
          image:item.image,
          place:{
            // region:cHandRegion,
            // hand:cHandId,
            country:cCountry,
            governorate:cRegionGovernorate,
            region:cReigionId

          },
          address:faker.address.streetAddress(),
        openStatus:openStatus,
        phone:faker.phone.number(),
        ratingsAverage:faker.helpers.arrayElement([1, 2, 3,4,5]),
        ratingsQuantity:faker.datatype.number({ min: 1, max: 100 }),
          rank: item.rank,
          active: item.active
        

      });
    })
    )
      

    console.log('---------End insert Company seeder'.green.inverse);
});

exports.destroyCompanySeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Company seeder'.red.inverse);
   
      await Company.deleteMany();
      
    console.log('---------end destroy Company seeder'.red.inverse);
});

this.insertCompanySeeder();