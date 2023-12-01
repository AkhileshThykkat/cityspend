require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = {
      user_email: decoded.user_email,
      user_name: decoded.user_name,
    };
    next();
  });
}

module.exports = {
  authenticate,
};
