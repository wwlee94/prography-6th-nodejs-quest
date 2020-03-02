import express from 'express';
import * as exception from '../exceptions/exception';
import util from '../utils/util';
import Todo from '../models/todo';

const router = express.Router();

router.get('/', findAllTodo);
router.get('/:todoId', findTodoById);
router.post('/', validateParams, createTodo);
router.put('/:todoId', updateTodo);
router.put('/:todoId/complete', updateTodoComplete);

// 모든 할 일 검색
function findAllTodo(req, res, next){
    Todo.find({})
        .then(todo => {
            if (!Object.keys(todo).length) return next(new exception.NotFoundDataError('검색된 할 일이 없습니다 !'))
            res.send(todo);
        })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });
};

// id로 특정 할 일 검색
function findTodoById(req, res, next){
    Todo.findOne({ "id": req.params.todoId })
        .then(todo => {
            if (!todo) return next(new exception.NotFoundDataError('존재하지 않는 ID입니다 !'))
            res.send(util.responseMsg(todo));
        })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });    
}

// 파라미터 검증
function validateParams(req, res, next){
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('등록에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.title) return next(new exception.InvalidParameterError('할 일 제목을 입력해주세요 !'));
    if (!req.body.description) return next(new exception.InvalidParameterError('할 일 내용을 입력해주세요 !'));
    else next();
};

// 할 일 추가
function createTodo(req, res, next){
    const todo = new Todo(req.body);
    todo.save()
        .then(todo => { res.send(todo); })
        .catch(err => { return next(new exception.ExceptionError(err.message)); });
};

// 할 일 수정
function updateTodo(req, res, next){
    Todo.findOne({ "id": req.params.todoId })
        .then(todo => { validateTodoAndUpdate(todo, req, res); })
        .catch(err => { 
            if (err instanceof exception.ExceptionError) return next(err);
            return next(new exception.ExceptionError(err.message));
         });
};

// 검증 후 Todo 정보 변경
function validateTodoAndUpdate(todo, req, res){
    let keys = Object.keys(req.body);
    if (!todo) throw  new exception.NotFoundDataError('존재하지 않는 ID입니다 !');
    if (!keys.length) throw new exception.NotFoundParameterError('변경에 필요한 파라미터 정보가 없습니다 !');

    keys.forEach(key => { todo[key] = req.body[key]; });
    todo.save()
        .then(todo => { res.send(todo); })
        .catch(err => { throw new exception.ExceptionError(err.message); });
}

// 할 일 완료
function updateTodoComplete(req, res, next){
    Todo.findOne({ "id": req.params.todoId })
        .then(todo => { validateIsCompleteAndUpdate(todo, req, res); })
        .catch(err => {
            return next(new exception.ExceptionError(err.message));    
        });
}
// 검증 후 isComplete 변경
function validateIsCompleteAndUpdate(todo, req, res){
    if (!todo) throw new exception.NotFoundDataError('존재하지 않는 ID입니다 !');
    if (todo.isCompleted) throw new exception.InvalidParameterError('이미 완료된 할 일입니다.');
    todo.isCompleted = true;
    todo.save()
        .then(todo => { res.send(todo); })
        .catch(err => { throw new exception.ExceptionError(err.message); });
}
export default router;