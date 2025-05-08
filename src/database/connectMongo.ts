import mongoose from "mongoose";
import { env } from "../config/env";

const MONGO_URI = env.MONGO_URL;

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI, {} as mongoose.ConnectOptions);
        console.log("MongoDB Connected!!! 🚀");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        setTimeout(connectMongo, 5000);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected, attempting to reconnect...");
    connectMongo();
});

export default connectMongo;