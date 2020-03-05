import express from 'express';
import bodyparser from 'body-parser';

const app = express();

// app 미들웨어
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); // qs의 기능 포함
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
});

// 라우트 설정
import todos from './router/todos';
import comments from './router/comments';
app.use('/todos', todos, comments);


// 로그, 에러 핸들러
const logHandler = (err, req, res, next) => {
    console.error('[' + new Date() + ']\n' + err.message);
    next(err);
}
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.type('json').send(JSON.stringify({ error: err || 'Uncaught Error !' }, null, 4));
}
app.use(logHandler);
app.use(errorHandler);

export default app;
