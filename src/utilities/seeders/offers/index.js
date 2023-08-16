const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Offer = require("../../../models/offerModel");
const Company = require("../../../models/companyModel");
const Product = require("../../../models/productModel");


// connect to DB
dbConnection();
exports.createRandomProducts=async()=> {
    const sampleProducts= await Product.aggregate([ { $sample: { size: 2 } } ]);
    products=[];
    
    sampleProducts.map(p=>{
        products.push({
            product:p._id,
            quantity:faker.helpers.arrayElement([1, 2, 3,4,5,6]),
            price:  faker.helpers.arrayElement([10, 20, 30,40,50,60]),  
            currency:'$'    
        })
        p._id});
  
    return products;

}
exports.insertOfferSeeder =  asyncHandler(async () => {

    await this.destroyOfferSeeder();

    console.log('---------Start insert Offer seeder'.green.inverse);
    const offerData =  JSON.parse(fs.readFileSync("./offer.json"));
   // console.log(productData);

    await Promise.all(
        offerData.map(async(item,index)=>{

           
           
const products = await this.createRandomProducts();
              
           
          

             console.log('products='+JSON.stringify(products))

            const sampleCompamny= await Company.aggregate([ { $sample: { size: 1 } } ]);
            const companyId=sampleCompamny[0]._id;

      await Offer.create({
        
      //_id:new ObjectId(item._id),
          name: item.name,
          slug: item.slug,
          products:products,
          totalPriceBefore:item.totalPriceBefore,
          totalPriceAfter:item.totalPriceAfter,
          start:faker.date.between('2023-1-1','2024-1-1'),
          end:faker.date.between('2023-1-1','2024-1-1'),
          company:companyId,
         
          rank: item.rank,
          active: item.active
        

      });
      console.log(`${index} - insert offer: ${item.name}`)
    })
    )
      

    console.log('---------End insert offer seeder'.green.inverse);
});

exports.destroyOfferSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Offer seeder'.red.inverse);
   
      await Offer.deleteMany();
      
    console.log('---------end destroy Offer seeder'.red.inverse);
});

this.insertOfferSeeder();