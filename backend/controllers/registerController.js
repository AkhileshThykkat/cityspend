const bcrypt = require('bcrypt');
const db = require('../dbConnection.js');
const register = async (req, res) => {
  try {
    const { user_name, user_email, password } = req.body;
    if (!(user_name && user_email && password)) {
      return res.status(400).send('Every field is required!');
    }
    const existing_user = await db.query(
      'select * from users where user_email = $1',
      [user_email]
    );
    console.log(existing_user.rows[0]);
    if (existing_user.rows[0]) {
      return res.status(409).send('Email already Exists');
    }
    const password_hash = await bcrypt.hash(password, 10);
    console.log(password_hash);
    const response = await db.query(
      'insert into users(user_name, user_email,password_hash) values($1,$2,$3) returning *',
      [user_name, user_email, password_hash]
    );
    console.log(response.rows[0]);
    console.log('register');
    return res.status(200).send('Success');
  } catch (error) {
    console.log('Register error : ', error);
    return res.status(500).send('Internal Server Error');
  }
};
module.exports = {
  register,
};
