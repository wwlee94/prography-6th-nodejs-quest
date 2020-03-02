import express from 'express';
import * as exception from '../exceptions/exception';
import util from '../utils/util';
import Todo from '../models/todo';

const router = express.Router();

// todos 목록 조회
router.get('/', (req, res) => {
    res.send('todos GET Router');
});

// todos 추가
router.post('/', validateParams, createTodo);

// 파라미터 검증
function validateParams(req, res, next){
    if (!req.body.title) return next(new exception.NotFoundParameterError('할일 제목을 입력해주세요 !'));
    if (!req.body.description) return next(new exception.NotFoundParameterError('할일 내용을 입력해주세요 !'));
    else next();
};

// 할일 추가
function createTodo(req, res, next){
    const todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.send(util.responseMsg(`[${todo.title}] 할 일을 등록했습니다 !`))
        })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });
};

export default router;