require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();
const connecDb = require('./src/db/connect');
// middlewares
const notFoundMiddleware = require('./src/middleware/not-found');
const errorHandlerMiddleware = require('./src/middleware/error-handler');
const authenticated = require('./src/middleware/authentication');
app.use(express.json());
// extra packages


// routes
const authRouter = require('./src/routes/auth');
const jobsRouter = require('./src/routes/jobs');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticated, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connecDb(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port} 🚀 `)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
