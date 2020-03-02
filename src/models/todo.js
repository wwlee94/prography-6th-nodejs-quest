const mongoose = require('mongoose');

// 스키마
var todo = mongoose.Schema({
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

module.exports = mongoose.model('Todo', todo);