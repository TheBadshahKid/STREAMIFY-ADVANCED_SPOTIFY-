import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Configuration using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("🔧 Cloudinary Config Test");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4) : "missing");

async function testCloudinary() {
    try {
        console.log("\n🔍 Testing Cloudinary connection...");
        
        // Test 1: Ping API
        const pingResult = await cloudinary.api.ping();
        console.log("✅ Ping successful:", pingResult);
        
        // Test 2: Create a simple test file and upload
        const testFilePath = path.join(process.cwd(), "test-image.txt");
        fs.writeFileSync(testFilePath, "This is a test file for Cloudinary upload");
        
        console.log("\n📤 Testing file upload...");
        const uploadResult = await cloudinary.uploader.upload(testFilePath, {
            resource_type: "raw",
            folder: "test"
        });
        
        console.log("✅ Upload successful:", {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        });
        
        // Cleanup
        fs.unlinkSync(testFilePath);
        await cloudinary.uploader.destroy(uploadResult.public_id, {
            resource_type: "raw"
        });
        
        console.log("✅ All tests passed!");
        
    } catch (error) {
        console.log("❌ Test failed:");
        console.log("Full error object:", error);
        console.log("Error type:", typeof error);
        console.log("Error toString:", error.toString());
        if (error.error) {
            console.log("Error.error:", error.error);
        }
        if (error.response) {
            console.log("Error.response:", error.response);
        }
        console.log("Stack trace:", error.stack);
    }
}

testCloudinary();
