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
    try {
        // 1. List Models
        console.log("\n--- Checking Available Models ---");
        // Note: listModels is on the genAI instance directly in newer versions, 
        // or via accessing the API directly if the SDK matches.
        // However, the standard way in JS SDK to just check model validity is often just trying it, 
        // but let's try to simulate a simple generation.

        // Actually, listModels isn't always exposed easily in the high-level client for browser users due to CORS,
        // but in node we can try. If SDK doesn't support it directly, we will try generation.

        // Let's verify specifically "gemini-1.5-flash"
        console.log("Attempting to generate with 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());

    } catch (error) {
        console.error("\n!!! Error with gemini-1.5-flash !!!");
        console.error(error.message);

        try {
            console.log("\nAttempting to generate with 'gemini-pro' (fallback)...");
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            const resultPro = await modelPro.generateContent("Hello?");
            const responsePro = await resultPro.response;
            console.log("Success with gemini-pro! Response:", responsePro.text());
        } catch (errPro) {
            console.error("\n!!! Error with gemini-pro !!!");
            console.error(errPro.message);
        }
    }
}

testConnection();
