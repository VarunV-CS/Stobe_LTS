// resumeController.js
const fs = require("fs");
const pdf = require("pdf-parse");
const docxParser = require("docx-parser"); // Import the module as an object
const path = require('path');
// Function to extract text from a PDF file
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Function to extract text from a DOCX file using docx-parser callback API
async function extractTextFromDOCX(docxPath) {
  const dataBuffer = fs.readFileSync(docxPath);
  return new Promise((resolve, reject) => {
    docxParser.parseDocx(dataBuffer, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Controller function for processing resumes
const processResume = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "File is required in the request." });
  }

  try {
    let text;
    const fileType = file.mimetype;

    if (fileType === "application/pdf") {
      text = await extractTextFromPDF(file.path);
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromDOCX(file.path);
    } else {
      return res.status(400).json({
        error: "Unsupported file type. Only PDF and DOCX are supported.",
      });
    }

    const prompt =
      "You are a document formatter. Format the input text into a professional document that matches the following structure: \n\n" +
      "1. Header: Includes the person's name and title.\n" +
      "2. Candidate Summary: A concise summary of the individual's professional experience and skills.\n" +
      "3. Skills Matrix: A table with skills and proficiency levels (1 to 5 scale).\n" +
      "4. Qualification: A table with qualification details (Qualification, Institution, End Date).\n" +
      "5. Certification: A table with certification details (Certificate, Institution, End Date).\n" +
      "6. Career Summary: A table summarizing roles (Company, Position, Start Date, End Date).\n" +
      "7. Career History: A detailed table with responsibilities for each role.\n" +
      "8. Key Skills: A bulleted list of key competencies.\n" +
      "9. References: Contact details of references.";

    res.json({
      extractedText: text,
      prompt: prompt,
    });
  } catch (error) {
    console.error("Error processing file:", error.message);
    res.status(500).json({ error: "An error occurred while processing the file." });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(file.path);
  }
};





const FAILED = (req, res) => {
  const filePath = path.join(__dirname,'..', 'FAILED.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
};
const COMPLETED = (req, res) => {
  const filePath = path.join(__dirname,'..', 'COMPLETED.JSON');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'COMPLETED to read file' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
};
const INPROGRESS = (req, res) => {
  const filePath = path.join(__dirname,'..', 'INPROGRESS.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'INPROGRESS to read file' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
};

module.exports = { processResume ,FAILED, COMPLETED , INPROGRESS};
