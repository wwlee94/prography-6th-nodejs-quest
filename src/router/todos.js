import express from 'express';
import * as exception from '../exceptions/exception';
import util from '../utils/util';
import Todo from '../models/todo';

const router = express.Router();

router.get('/', findAllTodo);
router.get('/:todoId', findTodoById);
router.post('/', validateParams, createTodo);

// 모든 할일 검색
function findAllTodo(req, res, next){
    Todo.find({})
        .then(todo => {
            if (!Object.keys(todo).length) return next(new exception.NotFoundDataError('검색된 할일이 없습니다 !'))
            res.send(util.responseMsg(todo));
        })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });
};

// id로 특정 할일 검색
function findTodoById(req, res, next){
    Todo.findOne({ "_id": req.params.todoId })
        .then(todo => {
            if (!Object.keys(todo).length) return next(new exception.NotFoundDataError('검색된 할일이 없습니다 !'))
            res.send(util.responseMsg(todo));
        })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });    
}

// 파라미터 검증
function validateParams(req, res, next){
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('파라미터가 비어있습니다 !'));
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