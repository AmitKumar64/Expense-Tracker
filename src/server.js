import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimit from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionRoute.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON request bodies
app.use(ratelimit);
app.use(express.json());

//  Middleware to log each request method
// app.use((req, res, next) => {
//    console.log("hey ", req.method);
//    next();
// });

// connectDB(process.env.DATABASE_URL);



app.get("/health ", (req, res) => {
  res.send("Hello from backend!!! this is server!  it's working");
});

app.use("/api/transactions", transactionRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});
