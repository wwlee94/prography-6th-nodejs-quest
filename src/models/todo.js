import mongoose from 'mongoose';
var autoIncrement = require('mongoose-auto-increment');

// 스키마
var todo = mongoose.Schema({
    id: {
        type: Number,
        trim: true
    },
    title: {
        type: String,
        required: [true, '제목을 입력해주세요 !'],
        trim: true
    },
    description: {
        type: String,
        required: [true, '내용을 입력해주세요 !'],
        trim: true
    },
    tags: {
        type: [String],
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
},
{
    versionKey: false,
    timestamps: true
});

todo.index({ id: 1 }, { unique: true });

autoIncrement.initialize(mongoose.connection); //중요
todo.plugin( autoIncrement.plugin, {
    model: 'Todo',
    field: 'id',
    startAt: 1
});

var schema = mongoose.model('Todo', todo);
export default schema;
// module.exports = mongoose.model('Todo', todo);