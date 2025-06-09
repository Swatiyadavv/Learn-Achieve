const express = require("express");
const path = require('path');         
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const mockTestRoutes = require('./routes/mockTestRoutes')
const packageRoutes = require('./routes/packageRoutes');
const cors = require('cors')
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 const mongoURI = process.env.MONGO_URI || "your_mongodb_atlas_connection_string_here";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/api/admin", adminRoutes);
app.use("/api/mockTest", mockTestRoutes);
app.use('/api/packages', packageRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
