import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1, // Per second
});

const rateLimitMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ success: false, message: 'Too Many Requests' });
    });
};

export default rateLimitMiddleware;
