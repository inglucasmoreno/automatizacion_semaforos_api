const { Router } = require('express');
const { login, renewToken } = require('../controllers/auth.controllers');

const router = Router();

router.post('/', login);
router.get('/', renewToken);

module.exports = router;