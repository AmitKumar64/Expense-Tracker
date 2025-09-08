import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Apply rate limiting
    const {success} = await rateLimit.limit("my-rate-limiter");

    if(!success){
      return res.status(429).json({message: "Too many requests. Please try again later."});
    }

    next();

  } catch (error) {
    console.log("Rate Limiter Error:", error);
    next();
  }
}


export default rateLimiter;