const router = require('express').Router();
const { getNews, saveNews, updateNews, deleteNews } = require('../controllers/news.controllers');

router.get('/news/', getNews);
router.post('/news/', saveNews);
router.put('/news/', updateNews);
router.delete('/news/', deleteNews);

module.exports = router;
