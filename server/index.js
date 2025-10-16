const express = require("express");
const cors = require("cors");
const mongoose=require("mongoose")
const userRecordRouter=require("./src/routes/userRoute");
const purchaseRecordRouter=require("./src/routes/purchaseRoute");
const adminRecordRouter=require("./src/routes/adminRoute");
var cookieParser = require('cookie-parser')
const app = express();
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // ✅ Allow cookies
  }));
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3001;




mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("CONNECTED TO MONGODB!"))
.catch((err) => console.error("FAILED to CONNECT TO MONGODB:", err));

app.use("/api/user", userRecordRouter);
app.use("/api/purchase", purchaseRecordRouter);
app.use("/api/admin",adminRecordRouter)


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});