import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env explicitly
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.VITE_GEMINI_API_KEY;

console.log("Testing Gemini API Connection...");
console.log("API Key present:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

async function testConnection() {
    const modelsToTest = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

    for (const modelName of modelsToTest) {
        try {
            console.log(`\nAttempting to generate with '${modelName}'...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            console.log(`Success with ${modelName}! Response:`, response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`!!! Error with ${modelName} !!!`);
            console.error(error.message);
        }
    }
    console.error("\nAll models failed.");
}

testConnection();
