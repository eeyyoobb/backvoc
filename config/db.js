import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("DB_URI:", process.env.DB_URI); 
    await mongoose.connect(process.env.DB_URI);
    console.log("Database is connected...");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};


export default connectDB;
