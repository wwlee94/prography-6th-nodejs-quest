import mongoose from 'mongoose';
var autoIncrement = require('mongoose-auto-increment');

// 스키마
var comment = mongoose.Schema({
    id: {
        type: Number,
        trim: true
    },
    todoId: {
        type: Number,
        required: [true, '할 일의 ID를 입력해주세요 !'],
        trim: true
    },
    contents: {
        type: String,
        required: [true, '댓글을 입력해주세요 !'],
        trim: true
    }
},
    {
        versionKey: false,
        timestamps: true
    });

comment.index({ id: 1 }, { unique: true });

// auto-increse 설정
autoIncrement.initialize(mongoose.connection);
comment.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'id',
    startAt: 1
});

var schema = mongoose.model('Comment', comment);
export default schema;