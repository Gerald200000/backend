const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const toolsRouter = require('./routes/tools');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tools', toolsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

module.exports = app;
