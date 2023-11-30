require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../dbConnection.js');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { user_email, password } = req.body;
    if (!(user_email && password)) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const current_user = await db.query(
      'select user_email,user_name,password_hash from users where user_email=$1',
      [user_email]
    );
    if (current_user.rows.length === 0) {
      return res.status(403).json({ message: 'Not Found' });
    }
    const passwordHash = current_user.rows[0].password_hash;
    const rightUserFlag = await bcrypt.compare(password, passwordHash);
    if (!rightUserFlag) {
      return res.status(403).json({ message: 'Incorrect Password' });
    }
    const accessToken = jwt.sign(
      {
        user_email: current_user.rows[0].user_email,
        user_name: current_user.rows[0].user_name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '180m' }
    );
    const refreshToken = jwt.sign(
      {
        user_email: current_user.rows[0].user_email,
        user_name: current_user.rows[0].user_name,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: 'login successfull',
      accessToken: accessToken,
    });
  } catch (error) {
    console.log('Login error : ', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
module.exports = {
  login,
};
