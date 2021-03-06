import express from 'express';
import * as exception from '../exceptions/exception';
import Todo from '../models/todo';
import Comment from '../models/comment';

const router = express.Router();

router.post('/', validateParams, createTodo);
router.get('/', findAllTodo);
router.get('/:todoId', findTodoById);
router.put('/:todoId', updateTodo);
router.put('/:todoId/complete', updateTodoComplete);
router.delete('/:todoId', deleteTodoById);

// 파라미터 검증
function validateParams(req, res, next) {
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('할 일 등록에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.title || !req.body.title.trim()) return next(new exception.InvalidParameterError('할 일 제목을 입력해주세요 !'));
    if (!req.body.description || !req.body.description.trim()) return next(new exception.InvalidParameterError('할 일 내용을 입력해주세요 !'));
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

// 모든 할 일 검색
async function findAllTodo(req, res, next) {
    let filterKey; // 필터의 기준이 될 필드
    let filterVal; // 필터 할 값 Ex) 과제
    let sorting = {}; // 정렬 할 키, 값
    let todo;
    try {
        // 검색 쿼리 파라미터가 존재할 때 id, title, description, tags로만 검색 가능
        let filter = Object.keys(req.query).filter(x => ['id', 'title', 'description', 'tags'].includes(x))[0];
        if (filter) {
            filterKey = filter;
            filterVal = req.query[filter];
        }
        // 정렬 쿼리 파라미터가 존재할 때 id, title, createdAt, updatedAt로만 정렬 가능
        let order = req.query.order;
        if (order) {
            let key = Object.keys(order)[0];
            if (!['id', 'title', 'createdAt', 'updatedAt'].includes(key))
                return next(new exception.InvalidParameterErrror("['id', 'title', 'createdAt', 'updatedAt'] 필드만 정렬 가능합니다 !"));
            if (!['asc', 'desc'].includes(order[key]))
                return next(new exception.InvalidParameterError("['asc', 'desc'] 오름차순, 내림차순으로만 정렬 가능합니다 !"));
            sorting[key] = order[key];
        }

        // 기본 검색 or 정렬
        if (!filter) todo = await Todo.find().sort(sorting);
        else {
            // tag 검색 + 정렬
            if (filterKey === 'tags') todo = await Todo.find().sort(sorting).in(filterKey, filterVal);
            // 그외 필드 검색 + 정렬
            else todo = await Todo.find().sort(sorting).regex(filterKey, new RegExp('.*' + filterVal + '.*', 'i'));
        }

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
        if (!todo) return next(new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !'))
        res.send(todo);

    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
}

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
    let body = req.body;
    let keys = Object.keys(body);
    if (!todo) throw new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !');
    if (!keys.length) throw new exception.NotFoundParameterError('변경에 필요한 파라미터 정보가 없습니다 !');

    keys.forEach(key => {
        if (['title', 'description', 'tags'].includes(key)) {
            if (!body[key] || !body[key].trim()) throw new exception.InvalidParameterError(`할 일의 ${key} 내용을 입력해주세요 !`);
            todo[key] = body[key];
        }
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
    if (!todo) throw new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !');
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
async function deleteTodoById(req, res, next) {
    try {
        let todo = await Todo.findOneAndDelete().where('id').equals(req.params.todoId);
        if (!todo) return next(new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !'));
        let comment = await Comment.deleteMany().where('todoId').equals(req.params.todoId); // 댓글도 함께 제거 !
        res.send({ "msg": "success" });

    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};
export default router;