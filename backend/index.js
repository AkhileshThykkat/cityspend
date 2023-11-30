require('dotenv').config();
const express = require('express');
const db = require('./dbConnection.js');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { register } = require('./controllers/registerController.js');
const { login } = require('./controllers/loginController.js');
const { refreshToken } = require('./controllers/refreshTokenController.js');
const { authenticate } = require('./middlewares/authenticate.js');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post('/api/register', register);

app.post('/api/login', login);
app.post('/api/token', refreshToken);
app.get('/', authenticate, function (req, res) {
  return res.send(`You are ${req.user.user_name}`);
});
try {
  db.connect()
    .then(() => {
      console.log('connected to db');
    })
    .catch((err) => console.log('db connection errror', err));
} catch (error) {
  console.log(error);
}

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
