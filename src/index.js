const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
app.use('/api/notes', notesRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.send('Notes API running'));

const start = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

module.exports = app;
