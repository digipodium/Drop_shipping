require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const seedAdmin = async () => {
 try {
 console.log("Connecting to MongoDB...");
 console.log("MONGO_URI:", process.env.MONGO_URI);
 
 await mongoose.connect(process.env.MONGO_URI, {
 connectTimeoutMS: 30000,
 socketTimeoutMS: 30000,
 serverSelectionTimeoutMS: 30000
 });
 console.log("Connected to MongoDB");

 // Check if admin already exists
 const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
 if (existingAdmin) {
 console.log("✅ Admin user already exists");
 console.log("Email: admin@gmail.com");
 console.log("Role: admin");
 await mongoose.disconnect();
 return;
 }

 // Hash password
 const hashedPassword = await bcrypt.hash("Admin@123", 10);

 // Create admin user
 const adminUser = new User({
 name: "Admin",
 email: "admin@gmail.com",
 password: hashedPassword,
 role: "admin",
 phone: "+1234567890",
 isActive: true
 });

 await adminUser.save();
 console.log("✅ Admin user created successfully!");
 console.log("Email: admin@gmail.com");
 console.log("Password: Admin@123");
 console.log("Role: admin");

 await mongoose.disconnect();
 console.log("Disconnected from MongoDB");
 } catch (error) {
 console.error("Error seeding admin:", error.message);
 console.error("Full error:", error);
 process.exit(1);
 }
};

seedAdmin();
