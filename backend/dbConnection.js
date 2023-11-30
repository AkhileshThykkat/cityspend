const { Client } = require('pg');
const connectionString = 'postgresql://postgres:admin@localhost:5432/cityspend';
const client = new Client({
  connectionString: connectionString,
});
module.exports = {
  connect: () => client.connect(),
  query: (text, params) => client.query(text, params),
  end: () => client.end(),
};
