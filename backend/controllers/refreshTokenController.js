require('dotenv').config();
const jwt = require('jsonwebtoken');

function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  // console.log(req.cookies);
  if (!refreshToken) return res.sendStatus(401); // unauthorized
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        console.log(err);
        return res.sendStatus(403); // forbidden
      }
      const newAccessToken = jwt.sign(
        {
          user_email: decoded.user_email,
          user_name: decoded.user_name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '300m' }
      );
      return res.status(201).json({
        accessToken: newAccessToken,
      });
    }
  );
}

module.exports = {
  refreshToken,
};
