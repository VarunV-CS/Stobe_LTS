const express = require("express");
const router = express.Router();
const multer = require("multer");
const { processResume,INPROGRESS, COMPLETED,FAILED } = require("../controllers/resumeController");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/process-resume", upload.single("file"), processResume);

router.get("/COMPLETED",  COMPLETED);
router.get("/FAILED",  FAILED);
router.get("/INPROGRESS",  INPROGRESS);
module.exports = router;
