const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../config.env" });
const dbConnection = require("../../../config/mongoDbConnection");

const Category = require("../../../models/categoryModel");
const Company = require("../../../models/companyModel");
const Brand = require("../../../models/brandModel");
const Product = require("../../../models/productModel");


// connect to DB
dbConnection();

exports.insertProductSeeder =  asyncHandler(async () => {

    await this.destroyProductSeeder();

    console.log('---------Start insert Product seeder'.green.inverse);
    const productData =  JSON.parse(fs.readFileSync("./product.json"));
   // console.log(productData);

    await Promise.all(
        productData.map(async(item,index)=>{

            const sampleCategory= await Category.aggregate([ { $sample: { size: 1 } } ]);
            const categoryId=sampleCategory[0]._id;

            const sampleBrand= await Brand.aggregate([ { $sample: { size: 1 } } ]);
            const brandId=sampleBrand[0]._id;

            const sampleCompamny= await Company.aggregate([ { $sample: { size: 1 } } ]);
            const companyId=sampleCompamny[0]._id;

      await Product.create({
        
      //_id:new ObjectId(item._id),
          title: item.title,
          slug: item.slug,
          image:item.image,
          quantity:item.quantity,
          sold:item.sold,
          price:item.price,
          priceAfterDiscount:item.priceAfterDiscount,
          company:companyId,
          category:categoryId,
          brand:brandId,
          imageCover:item.imageCover,
          ratingsAverage:item.ratingsAverage,
          ratingsQuantity:item.ratingsQuantity,
         
        
          rank: item.rank,
          active: item.active
        

      });
      console.log(`${index} - insert product: ${item.title}`)
    })
    )
      

    console.log('---------End insert Product seeder'.green.inverse);
});

exports.destroyProductSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Product seeder'.red.inverse);
   
      await Product.deleteMany();
      
    console.log('---------end destroy Product seeder'.red.inverse);
});

this.insertProductSeeder();