require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api.routes");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const app = express();
const PORT = process.env.PORT || 3003;

// Allowed origins (add other domains if needed)
const allowedOrigins = [
  process.env.FE1,
  process.env.FE2,
  process.env.FE3,
  process.env.FE4,
];
// Connect to MongoDB
connectDB();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SRECERT_KEY,
});

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests
      } else {
        callback(new Error("Not allowed by CORS")); // Block requests
      }
    },
    credentials: true, // Allow cookies if needed
  })
);

// Enable preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());

// Increase limit for JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api", apiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
