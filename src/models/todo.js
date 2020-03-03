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
    },
    description: {
        type: String,
        required: [true, '내용을 입력해주세요 !'],
    },
    tags: {
        type: [String],
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

// auto-increse 설정
autoIncrement.initialize(mongoose.connection);
todo.plugin(autoIncrement.plugin, {
    model: 'Todo',
    field: 'id',
    startAt: 1
});

var schema = mongoose.model('Todo', todo);
export default schema;
// module.exports = mongoose.model('Todo', todo);