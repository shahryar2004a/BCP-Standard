// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { processExcelFile } = require('../controller/uploadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), processExcelFile);

module.exports = router;
