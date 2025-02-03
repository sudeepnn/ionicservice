import dotenv from "dotenv";
import express from "express";


import bodyParser from "body-parser";
import cors from "cors"
import router from "./routes/route";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors())

app.use(express.json());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI! )
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));
app.use("/api/v1",router);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
