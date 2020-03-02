import express from 'express';

const router = express.Router();

// todos 목록 조회
router.get('/', (req, res) => {
    res.send('todos GET Router');
});

// todos 추가
router.post('/', (req, res) => {
    res.send('todos POST Router');
});

export default router;