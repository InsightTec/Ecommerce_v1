const XLSX = require("xlsx");
const fs = require("fs");
require("colors");
const { faker } = require("@faker-js/faker");

const  { ObjectId } =require('mongodb');
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../../../config.env" });
const dbConnection = require("../../../../config/mongoDbConnection");

const Category = require("../../../../models/categoryModel");
const Company = require("../../../../models/companyModel");
const Brand = require("../../../../models/brandModel");
const Product = require("../../../../models/productModel");


// connect to DB
dbConnection();

exports.insertProductSeeder =  asyncHandler(async () => {

    console.time();
    //await this.destroyProductSeeder();

    console.log('---------Start insert Produc seeder'.green.inverse);

//var workbook = XLSX.readFile("./excelFiles/eatings.xlsx");
//var workbook = XLSX.readFile("./excelFiles/foodstuffs.xlsx");
//  var workbook = XLSX.readFile("./excelFiles/drinks.xlsx");
// var workbook = XLSX.readFile("./excelFiles/fruits.xlsx");
// var workbook = XLSX.readFile("./excelFiles/vegetable.xlsx");
// var workbook = XLSX.readFile("./excelFiles/baharat.xlsx");
// var workbook = XLSX.readFile("./excelFiles/summit.xlsx");
// var workbook = XLSX.readFile("./excelFiles/icecream.xlsx");
// var workbook = XLSX.readFile("./excelFiles/detergent.xlsx");
var workbook = XLSX.readFile("./excelFiles/accessories.xlsx");

//show all sheet names here is 5 (  'admin1','admin2','admin3','city_neighbourhoods','Location'  and info for sheets 'ESRI_MAPINFO_SHEET')
console.log(workbook.SheetNames);
 //const data=XLSX.utils.sheet_to_json(workbook.Sheets['Location']);
 const data=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);


 const units={
    'قطعة':'64f34b06563ce3cc88401c6a',
    'حبة':'64f34b8a563ce3cc88401c71',
    'كيلو':'64f34c10563ce3cc88401c78',
    'ربطة':'64f34c57563ce3cc88401c7f',
    'ظرف':'64f34c9b563ce3cc88401c86',
 }
 const companyId='6486ff371d7682014ca16560'  

 //const categoryId='64f2f91df32a6bf994a0b518'  // eatings
 //const categoryId='64f2ebeaf32a6bf994a0b43d'  // foodstuffs
//  const categoryId='64f2ee22f32a6bf994a0b4c8'  // drinks
 // const categoryId='64f2f809f32a6bf994a0b4f5'  // fruits
//  const categoryId='64f2f836f32a6bf994a0b4fc'  // vegetable
//  const categoryId='64f2f86ff32a6bf994a0b503'  // baharat
//  const categoryId='64f2f8aef32a6bf994a0b50a'  // summit
//  const categoryId='64f2f8eff32a6bf994a0b511'  // icecream
//  const categoryId='64f2f3d5f32a6bf994a0b4d7'  // detergent
const categoryId='64f2f7d5f32a6bf994a0b4e6'  // accessories


await Promise.all(
    data.map(async (item,index)=>{
    
    //     let quantity=1;
    //     if(item.quantity !=''){
    //         quantity=Number(item.quantity)
    //     if(quantity<0)
    //        quantity=1;
    //     }
           
    // console.log('index',index)
    // console.log('title',item.title)
    // console.log('quantity',quantity)
   
        await Product.create({
        
            //_id:new ObjectId(item._id),
                title: item.title,
                quantity:10,
                price:item.price,
                company:new ObjectId(companyId),
                category:new ObjectId(categoryId),
                unit:new ObjectId(units[item.unit]),
                currency:'₺',
                rank: 1,
                active: true
              
      
            });

    
     console.log('====================');
     console.log('item',item);
    }))
    console.log('---------End insert Product seeder'.green.inverse);
 });

exports.destroyProductSeeder =  asyncHandler(async () => {

    console.log('---------start  destroy Product seeder'.red.inverse);
   
    try {
        
        await Product.deleteMany();
        
        
    
      
      } catch (error) {
        console.log(error);
      }
      
    console.log('---------end destroy Product seeder'.red.inverse);
});

this.insertProductSeeder();
//this.destroyProductSeeder();