const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
//const os = require("os");
const path = require("path");

// env file in src/

const dbConnection = require("./config/mongoDbConnection");
const redisConnection = require("./config/redisConnection");
const cors = require("cors");
// in atlas 
//dotenv.config({ path: "../config.env" });
// in docker 
///// dotenv.config({ path: "./config.env" });
const compression = require("compression");
var bodyParser = require('body-parser')
const ApiError = require("./utilities/apiError");
//error

const globalError = require("./middlewares/errorMiddleware");

// logger
const logger=require('./utilities/logger/logger');    // winston logger

// init app
const app = express();
const PORT = process.env.PORT || 4000;
// Enable other domains to access your application
app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:8081', 'http://localhost:8082'],
//}));
app.options("*", cors());

// compress all responses
app.use(compression());

//connect_redis();
//redisConnection();

// Connect with db
dbConnection();

// Middlewares
app.use(express.json());

// to enable access to images by link as:http://localhost:3000/categories/category-3.jpeg
app.use(express.static(path.join(__dirname, "uploads")));



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
app.get("/", async (req, res) => {
  // console.log(`traffic ${os.hostname}`);
  // await client.set("test", "test value");
  // res.send("<h1>Hello</h1>");
   res.send("<h1>Hello</h1>");
});
app.get("/test", async (req, res) => {
  // const test = await client.get("test");
  // res.send(`<h1>Hello: ${test}</h1>`);
   res.send(`<h1>Hello:</h1>`);
});

  // Routes
  const mountRoutes = require("./routes");


  // Mount Routes
  mountRoutes(app);
  app.all("*", (req, res, next) => {
    // const err=new Error(`rout not found : ${req.originalUrl}`);
    // next(err.message);
 
    next(new ApiError(`route not found : ${req.originalUrl}`, 401));
  });
  // Global error handling middleware ,
  // when there is 4 parameters express know error middleware
  app.use(globalError);

  const server = app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
    // Using winsotn to log objects is as simple as:
// //logger.warn( 'auth-log',{ level1: "auth1" , level2: "auth2" })

  });
  
  // listen any error out express
  process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Error: ${err.name}| ${err.message}`);
    //close server
    server.close(() => {
      console.error("shutting down.....");
      //shutdown application
      process.exit(1);
    });
  });
  