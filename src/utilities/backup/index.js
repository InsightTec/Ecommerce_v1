const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require("dotenv");
const backupFolderPath = 'src/uploads/backup/folder'; // Replace this with the desired backup folder path
dotenv.config({ path: "../../../config.env" });
const dbConnection = require("../../config/mongoDbConnection");
// connect to DB
dbConnection();

async function backupCollection(dbName, collectionName) {
  try {
    // Fetch all documents from the collection
    const Model = mongoose.model(collectionName, new mongoose.Schema({ /* Your schema definition */ }));
    const data = await Model.find().lean().exec();

    // Write the data to a backup file
    const backupFilePath = `${backupFolderPath}/${dbName}_${collectionName}.json`;
    fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2));
    console.log(`Backup of '${collectionName}' collection in '${dbName}' database successful!`);
  } catch (error) {
    console.error(`Error occurred during backup of collection '${collectionName}' in '${dbName}' database:`, error);
  }
}

async function backupDatabase(dbName) {
  try {
      const data = await Company.find().lean().exec();

  // // Write the data to a backup file
//    fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2));
//     console.log(`Backup of '${dbName}' database completed!`);
  } catch (error) {
    console.error(`Error occurred during backup of '${dbName}' database:`, error);
  }
}

async function backupAllDatabases() {
  try {
    // Fetch all database names
// Get all the collections in your database
const collections = mongoose.connection.collections;

// Create a backup file
const backupFile = "mydb_backup.json";

  // Iterate over all the collections and save them to the backup file
collections.forEach((collection) => {
    const documents = collection.find().toArray();
    const jsonData = JSON.stringify(documents);
    fs.writeFileSync(backupFile, jsonData);
  });
  
  // Close the connection to your database
  mongoose.disconnect();
     
   
  } catch (error) {
    console.error('Error occurred during backup:', error);
  } finally {
    // Close the Mongoose connection
    mongoose.connection.close();
  }
}

backupAllDatabases();
