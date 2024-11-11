import mongoose from "mongoose";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    return res.send("The X API is running");
});

import userRoutes from "./routes/user";

app.use("/api", userRoutes);

const MONGO_URL = process.env.MONGO_URL || "";
mongoose
    .connect(MONGO_URL, {})
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));

