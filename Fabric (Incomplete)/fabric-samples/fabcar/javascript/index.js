const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const addProperty = require('./addProperty');
const updateProperty = require('./updateProperty');
const queryProperty = require('./queryProperty');

const app = express();

// CORS setup
app.use(cors());
app.options('*', cors());

// Body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (assuming your HTML file is in the root directory)
app.use(express.static(path.join(__dirname)));

// Create a new property
app.post('/add-property', function (req, res) {
    addProperty.main(req.body)
        .then(result => {
            res.send({ message: 'Property added successfully' });
        })
        .catch(err => {
            console.error('Failed to add property:', err);
            res.status(500).send({ error: 'Failed to add property!' });
        });
});

// Update property information
app.post('/update-property', function (req, res) {
    updateProperty.main(req.body)
        .then(result => {
            res.send({ message: 'Property updated successfully' });
        })
        .catch(err => {
            console.error('Failed to update property:', err);
            res.status(500).send({ error: 'Failed to update property!' });
        });
});

// View property history
app.post('/view-history', function (req, res) {
    const propertyId = req.body.historyPropertyId; // Assuming the property ID is sent in the request body
    // Implement logic to fetch and send the history of updates for the specified propertyId
    // Modify this part based on your backend implementation
    res.send({ message: 'View history functionality to be implemented.' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
