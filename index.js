require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");
const File = require("./models/File");

app.use(express.json());
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/upload", upload.single("upfile"), async (req, res) => {
  if (req.file) {
    try {
      await File.create({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      });

      res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      });
    } catch (error) {
      res.status(500).json({ error: "Error saving file to database" });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

start();
