require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });

    await file.save();
    res.json({ name: req.file.originalname, type: req.file.mimetype, size: req.file.size });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error uploading file" });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

start();
