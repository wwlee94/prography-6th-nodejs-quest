import express from 'express';
import * as exception from '../exceptions/exception';
import Todo from '../models/todo';

const router = express.Router();

router.get('/', findAllTodo);
router.get('/:todoId', findTodoById);
router.post('/', validateParams, createTodo);
router.put('/:todoId', updateTodo);
router.put('/:todoId/complete', updateTodoComplete);
router.delete('/:todoId', deleteTodoById);

// 모든 할 일 검색
async function findAllTodo(req, res, next) {
    try {
        let todo = await Todo.find();
        if (!Object.keys(todo).length) return next(new exception.NotFoundDataError('검색된 할 일이 없습니다 !'))
        res.send(todo);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// id로 특정 할 일 검색
async function findTodoById(req, res, next) {
    try {
        let todo = await Todo.findOne().where('id').equals(req.params.todoId);
        if (!todo) return next(new exception.NotFoundDataError('존재하지 않는 ID입니다 !'))
        res.send(todo);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
}

// 파라미터 검증
function validateParams(req, res, next) {
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('할 일 등록에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.title) return next(new exception.InvalidParameterError('할 일 제목을 입력해주세요 !'));
    if (!req.body.description) return next(new exception.InvalidParameterError('할 일 내용을 입력해주세요 !'));
    else next();
};

// 할 일 추가
async function createTodo(req, res, next) {
    let todo = new Todo(req.body);
    try {
        await todo.save();
        res.send(todo);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 할 일 수정
async function updateTodo(req, res, next) {
    try {
        let todo = await Todo.findOne().where('id').equals(req.params.todoId);
        await validateTodoAndUpdate(todo, req, res);
    } catch (err) {
        if (err instanceof exception.ExceptionError) return next(err);
        return next(new exception.ExceptionError(err.message));
    }
};

// 검증 후 Todo 정보 변경 - title, description, tags만 수정 가능
async function validateTodoAndUpdate(todo, req, res) {
    let keys = Object.keys(req.body);
    if (!todo) throw new exception.NotFoundDataError('존재하지 않는 ID입니다 !');
    if (!keys.length) throw new exception.NotFoundParameterError('변경에 필요한 파라미터 정보가 없습니다 !');

    keys.forEach(key => {
        if (['title', 'description', 'tags'].includes(key)) todo[key] = req.body[key];
    });
    try {
        await todo.save();
        res.send(todo);
    } catch (err) {
        throw new exception.ExceptionError(err.message);
    }
};

// 할 일 완료
async function updateTodoComplete(req, res, next) {
    try {
        let todo = await Todo.findOne().where('id').equals(req.params.todoId);
        await validateIsCompleteAndUpdate(todo, req, res);
    } catch (err) {
        if (err instanceof exception.ExceptionError) return next(err);
        return next(new exception.ExceptionError(err.message));
    }
};
// 검증 후 isComplete 변경
async function validateIsCompleteAndUpdate(todo, req, res) {
    if (!todo) throw new exception.NotFoundDataError('존재하지 않는 ID입니다 !');
    if (todo.isCompleted) throw new exception.InvalidParameterError('이미 완료된 할 일입니다.');
    todo.isCompleted = true;

    try {
        await todo.save();   
        res.send(todo);
    } catch (err) {
        throw new exception.ExceptionError(err.message);
    }
};

// 할 일 삭제
async function deleteTodoById(req, res, next){
    try {
        let todo = await Todo.findOneAndDelete().where('id').equals(req.params.todoId);
        if (!todo) return next(new exception.NotFoundDataError('존재하지 않는 ID입니다 !'));
        res.send({"msg": "success"});
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};
export default router;