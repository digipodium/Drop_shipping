require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
    const client = new MongoClient(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
    });

    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("mydb");
        const usersCollection = db.collection("users");

        // Check if admin exists
        const existingAdmin = await usersCollection.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("✅ Admin user already exists");
            await client.close();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        // Insert admin user
        const result = await usersCollection.insertOne({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            phone: "+1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@gmail.com");
        console.log("Password: Admin@123");
        console.log("Role: admin");
        console.log("ID:", result.insertedId);

        await client.close();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();
