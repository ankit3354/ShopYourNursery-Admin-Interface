require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api.routes");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = process.env.PORT || 3003;

// Allowed origins (add other domains if needed)
const allowedOrigins = [process.env.FE1, process.env.FE2, process.env.FE3];
// Connect to MongoDB
connectDB();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SRECERT_KEY, // Click 'View API Keys' above to copy your API secret
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

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  })
);
// Enable preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRoutes);
// app.use("/api", plantsRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
