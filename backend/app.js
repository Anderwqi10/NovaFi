const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const pgRoutes = require('./routes/pg.routes');
const { initDb } = require('./db/init');
initDb();

const stage = process.env.NODE_ENV || 'production';
dotenv.config({ path: `${stage}.env` });

const app = express();
app.set('env', stage);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('node is running');
});

app.use('/api/pg', pgRoutes);

if (module === require.main) {
  const server = app.listen(process.env.PORT || 1357, function () {
    console.log('App listening on port %s', server.address().port);
  });
}

module.exports = app;
