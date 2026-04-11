// This guarantees it finds the .env file no matter where you run the command from
require("dotenv").config({ path: __dirname + "/../.env" }); 

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URI;

// CRUCIAL: This will print the URL so we know exactly where data is going!
console.log("Connecting to:", dbUrl); 

main()
  .then(() => {
    console.log("connected to DB");
    initDB(); // Moved the call here to ensure it runs after connection
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    
    // --- UPDATE: Mapping the owner ID ---
    // Replace the ID below with the one you copied from MongoDB Atlas (Parth Dubey's ID)
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: "69bfe02ee04c80ce938365d7" 
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Initialization Error:", err);
  } finally {
    // Optional: Close connection after seeding is done
    // mongoose.connection.close(); 
  }
};