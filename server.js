const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
const PORT = process.env.PORT || 3000;
const csvFilePath = process.env.RAILWAY_VOLUME_MOUNT_PATH + '/answers.csv'; // this is for deployment! remove the ./
let csvWriter;

function initializeCsvWriter(headers) {
    csvWriter = createCsvWriter({
        path: csvFilePath,
        header: headers,
        append: true // This option ensures new data is appended to the file
    });
}
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submissions
app.post('/submit', (req, res) => {
    const {pid, answers, engagement, alignment} = req.body;
    // Save the answers to a file or database
    console.log('Received answers:', pid,  answers, engagement, alignment);
    const headers = [
        { id: 'pid', title: 'PID' },
        { id: 'engagement', title: 'Engagement' },
        ...answers.map((_, index) => ({ id: `answer_${index}`, title: `Answer_${index}` })),
        { id: 'alignment', title: 'Alignment' }
    ];
    // Initialize the CSV writer with dynamic headers
    initializeCsvWriter(headers);

    // Flatten the answers array for CSV storage
    const flattenedData = {
        pid,
        engagement,
        ...Object.fromEntries(answers.map((answer, index) => [`answer_${index}`, answer])),
        alignment
    };

    // Write data to CSV file
    csvWriter.writeRecords([flattenedData])
        .then(() => {
            console.log('Data written to CSV file successfully');
            res.send('Answers received and saved');
        })
        .catch(error => {
            console.error('Error writing to CSV file', error);
            res.status(500).send('Error saving answers');
        });
});

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
