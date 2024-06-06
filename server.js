const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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
    fs.writeFileSync('answers.json', JSON.stringify(answers, null, 2)); //change this to also output id answers and engagement
    res.send('Answers received');
});
// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
