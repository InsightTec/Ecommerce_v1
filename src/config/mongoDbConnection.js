const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const dbConnection = () => {
  const connectDbDoker = async () =>{
  // connect MongoDB
const DB_USER = "root";
const DB_PASSWORD = "example";
const DB_HOST = "mongo"; // name of service in docker-commpose
const DB_PORT = 27017; // mapping port in mongo service  in docker-compose

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
//const URI = `mongodb+srv://test_user:example@cluster0.jlyme64.mongodb.net/test`;

    await mongoose
    .connect(URI)
    .then(() => console.log("connected to mongodb by doker : successfully"))
    .catch((err) => console.log(err));
//     await mongoose.connect('mongodb+srv://test_user:example@cluster0.jlyme64.mongodb.net/test?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas!');
});
  
  }

  const connectDbAtlas = async () =>{
    // connect MongoDB
  const MONGODB_USER = process.env.MONGODB_USER;
  const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
  const MONGODB_HOST = process.env.MONGODB_HOST; // name of service in docker-commpose
  const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION; 
  const MONGODB_PORT = process.env.MONGODB_PORT; // mapping port in mongo service  in docker-compose
  console.log('MONGODB_USER='+MONGODB_USER)
  console.log('MONGODB_HOST='+MONGODB_HOST)
  console.log('MONGODB_COLLECTION='+MONGODB_COLLECTION)
  console.log('MONGODB_PORT='+MONGODB_PORT)
  
  
 //const URI = `mongodb://${MONGODB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
 const URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_COLLECTION}?retryWrites=true&w=majority`;
  //const URI = `mongodb+srv://test_user:example@cluster0.jlyme64.mongodb.net/ecommerce1?retryWrites=true&w=majority`;
  //const URI = process.env.MONGODB_URI
  
  
      // await mongoose
      // .connect(URI)
      // .then(() => console.log("connected to mongodb : successfully"))
      // .catch((err) => console.log(err));
      await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB Atlas!');
  });
    
    }
    
 // connectDbDoker();

  connectDbAtlas();
};

module.exports = dbConnection;
