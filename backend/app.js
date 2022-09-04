require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

app.use(cors({
  Origin: 'https://legion3d.students.nomoredomainssbs.ru/ http://localhost:3001/',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', require('./routes/auth'));

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Не правильный путь'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
