import express from 'express';
import * as exception from '../exceptions/exception';
import Todo from '../models/todo';
import Comment from '../models/comment';

const router = express.Router();

router.post('/:todoId/comments', validateParams, createComment);

// 파라미터 검증
async function validateParams(req, res, next) {
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('댓글 등록에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.contents) return next(new exception.InvalidParameterError('할 일의 댓글 내용을 입력해주세요 !'));
    
    try {
        let todo = await Todo.findOne().where('id').equals(req.params.todoId);
        if (!todo) return next(new exception.NotFoundDataError('존재하지 않는 ID입니다 !'));
        next();   
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 등록
async function createComment(req, res, next){
    req.body['todoId'] = req.params.todoId;
    console.log(req.body);
    let comment = new Comment(req.body);
    try {
        await comment.save();
        res.send(comment);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};
export default router;