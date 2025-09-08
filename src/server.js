import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimit from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionRoute.js";
import job from "./config/cron.js";


const app = express();

if(process.env.NODE_ENV === "production")job.start()

// Middleware to parse JSON request bodies
app.use(ratelimit);
app.use(express.json());

//  Middleware to log each request method
// app.use((req, res, next) => {
//    console.log("hey ", req.method);
//    next();
// });

// connectDB(process.env.DATABASE_URL);


const PORT = process.env.PORT || 5001;


app.get("api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/transactions", transactionRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});
