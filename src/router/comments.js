import express from 'express';
import * as exception from '../exceptions/exception';
import Todo from '../models/todo';
import Comment from '../models/comment';

const router = express.Router();

router.post('/:todoId/comments', validateParams, createComment);
router.get('/:todoId/comments', findAllByCommentById);
router.get('/:todoId/comments/:commentId', findCommentById);
router.put('/:todoId/comments/:commentId', updateComment);
router.delete('/:todoId/comments/:commentId', deleteCommentById);

// 파라미터 검증
async function validateParams(req, res, next) {
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('댓글 등록에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.contents || !req.body.contents.trim()) return next(new exception.InvalidParameterError('할 일의 댓글 내용을 입력해주세요 !'));

    try {
        let todo = await Todo.findOne().where('id').equals(req.params.todoId);
        if (!todo) return next(new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !'));
        next();
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 등록
async function createComment(req, res, next) {
    req.body['todoId'] = req.params.todoId;
    let comment = new Comment(req.body);
    try {
        await comment.save();
        res.send(comment);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 목록 조회
async function findAllByCommentById(req, res, next) {
    try {
        let todo = await Todo.aggregate()
            .match({ id: Number(req.params.todoId) })
            .lookup({
                from: 'comments',   // models에서 선언된 모델 이름 말고 컬렉션 이름
                localField: 'id',
                foreignField: 'todoId',
                as: 'Comments'
            });
        if (!todo[0]) return next(new exception.NotFoundDataError('해당 ID로 검색된 할 일이 없습니다. 다시 입력해주세요 !'));
        if (!todo[0].Comments[0]) return next(new exception.NotFoundDataError('등록된 댓글이 없습니다.'));
        res.send(todo[0].Comments);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 읽기
async function findCommentById(req, res, next) {
    try {
        let comment = await Comment.findOne()
            .where('id').equals(req.params.commentId)
            .where('todoId').equals(req.params.todoId);
        if (!comment) return next(new exception.NotFoundDataError('해당 ID로 검색된 댓글이 없습니다. 다시 입력해주세요 !'));
        res.send(comment);
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 수정
async function updateComment(req, res, next) {
    if (!Object.keys(req.body).length) return next(new exception.NotFoundParameterError('댓글 수정에 필요한 파라미터 정보가 없습니다. !'));
    if (!req.body.contents || !req.body.contents.trim()) return next(new exception.InvalidParameterError('수정할 댓글 내용을 입력해주세요 !'));
    try {
        let comment = await Comment.findOneAndUpdate(
            { id: Number(req.params.commentId), todoId: Number(req.params.todoId) },
            { contents: req.body.contents },
            { new: true }
        );
        if (!comment) return next(new exception.NotFoundDataError('해당 ID로 검색된 댓글이 없습니다. 다시 입력해주세요 !'));
        res.send(comment);
        // Chaining 방식
        // let comment = await Comment
        //     .where('id').equals(req.params.commentId)
        //     .where('todoId').equals(req.params.todoId)
        //     .update({ contents: req.body.contents }).setOptions({ new: true});
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};

// 댓글 삭제
async function deleteCommentById(req, res, next) {
    try {
        let comment = await Comment.findOneAndDelete()
            .where('id').equals(req.params.commentId)
            .where('todoId').equals(req.params.todoId);
        if (!comment) return next(new exception.NotFoundDataError('해당 ID로 검색된 댓글이 없습니다. 다시 입력해주세요 !'));
        res.send({ "msg": "success" });
    } catch (err) {
        return next(new exception.ExceptionError(err.message));
    }
};
export default router;