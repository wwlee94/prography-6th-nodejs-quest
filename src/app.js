import express from 'express';
import bodyparser from 'body-parser';

const app = express();

// app 미들웨어
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
});

// 라우트 설정
import todos from './router/todos';
app.use('/todos', todos);

// 로그, 에러 핸들러 
// function logHandler(err, req, res, next) {
//   // if (process.env.NODE_ENV === "test") 
//   console.error('[' + new Date() + ']\n' + err.stack);
//   next(err);
// }
function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.type('json').send(JSON.stringify({ error: err || 'Uncaught Error !' }, null, 4));
}
// app.use(logHandler);
app.use(errorHandler);

export default app;
