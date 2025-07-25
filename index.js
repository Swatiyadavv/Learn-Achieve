const express = require("express");
const path = require('path');         
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const adminRoutes = require("./routes/adminRoutes");
const mockTestRoutes = require('./routes/mockTestRoutes')
const packageRoutes = require('./routes/packageRoutes');
const userRoutes = require("./routes/userRoutes");
const publicPackageRoutes = require('./routes/publicPackageRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const classMasterRoutes = require('./routes/classMasterRoutes');
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const mockTestfetch = require('./routes/mockTestUserRoute')
const subjectRoutes = require('./routes/subjectRoutes');
const questionRoutes = require('./routes/questionRoute');
const authorRoutes = require('./routes/AddAuthorRoutes');
const blogRoutes = require("./routes/blogRoutes");
const invoiceRoutes = require('./routes/invoiceRoutes');
const studentRoutes = require("./routes/studentRoutes");
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const studyMaterial = require('./routes/studyMaterialRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const topicRoutes = require('./routes/topicRoutes');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 const mongoURI = process.env.MONGO_URI || "your_mongodb_atlas_connection_string_here";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/api/admin", adminRoutes);
app.use("/api/mockTest", mockTestRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/users' , userRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', publicPackageRoutes); 
app.use('/api/classMaster',classMasterRoutes)
app.use("/api/blog", blogCategoryRoutes);
app.use('/api/question',questionRoutes);
app.use('/api/mockTestfetch', mockTestfetch);
app.use('/api/subject', subjectRoutes);
app.use('/api/author', authorRoutes);
app.use("/api/AddBlogs", blogRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/coordinators', coordinatorRoutes);
app.use('/api/study',studyMaterial);
app.use('/api/module',moduleRoutes);
app.use('/api/topic',topicRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
