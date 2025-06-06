const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/admin_auth")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
