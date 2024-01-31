const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Status = require('../models/status');

const { validateFirebaseId, validateUpdateStatus } = require('./validations');


//call to fetch all the statuses
router.get('/', async (req, res) => {
    try {
        const statuses = await Status.find().sort('date');

        if (!statuses || statuses.length === 0)
            return res.status(404).send('No records exists.');

        res.send(statuses);
    } catch (error) {
        res.status(500).send('An error occurred while fetching statuses.');
    }
});

//call to fetch all the statuses for a particular firebase id
router.get('/:firebase_id', validateFirebaseId, async (req, res) => {
    const firebaseId = req.params.firebase_id; // Get firebase_id from the URL parameter

    try {
        const status = await Status.find({ firebase_id: firebaseId });

        if (!status)
            return res.status(404).send('No records exist for the given Firebase ID.');

        res.send(status[0].statuses); // Send only the statuses array
    } catch (error) {
        res.status(500).send('An error occurred while fetching statuses.');
    }
});


//call to post a new status
router.post('/', async (req, res) => {
    try {
        let status = await Status.findOne({ firebase_id: req.body.firebase_id });

        const statusEntry = {
            student_group: req.body.student_group,
            type: req.body.status_type,
            status: req.body.status,
            date: req.body.date || Date.now()
        };

        if (status) {
            // If the document with this firebase_id exists, push the new status entry
            status.statuses.push(statusEntry);
        } else {
            // If the document doesn't exist, create a new one
            status = new Status({
                firebase_id: req.body.firebase_id,
                statuses: [statusEntry]
            });
        }

        await status.save();
        res.send(status);
    } catch (error) {
        res.status(500).send('An error occurred while saving status.');
    }
});

//call to update a status
router.put('/:firebase_id', validateUpdateStatus, async (req, res) => {
    const firebaseId = req.params.firebase_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    try {
        const statusDoc = await Status.findOne({ firebase_id: firebaseId });
        if (!statusDoc) {
            return res.status(404).send('Firebase ID not found.');
        }

        const statusEntry = statusDoc.statuses.find(status => {
            const statusDate = new Date(status.date);
            statusDate.setHours(0, 0, 0, 0);
            return statusDate.getTime() === today.getTime();
        });

        if (!statusEntry) {
            return res.status(404).send('No status entry found for today.');
        }

        // Check if there are changes to be made
        const isChanged = Object.entries(req.body).some(([key, value]) => {
            return statusEntry[key] !== value;
        });

        if (!isChanged) {
            return res.status(200).send('No changes made to the status.');
        }

        // Update the status entry fields
        statusEntry.student_group = req.body.student_group || statusEntry.student_group;
        statusEntry.type = req.body.status_type || statusEntry.type;
        statusEntry.status = req.body.status || statusEntry.status;

        await statusDoc.save();
        res.send(statusEntry);
    } catch (error) {
        res.status(500).send('An error occurred while updating the status.');
    }
});

//call to delete a status
router.delete('/:firebase_id/:status_id', async (req, res) => {
    const { firebase_id, status_id } = req.params;

    try {
        const statusDoc = await Status.findOne({ firebase_id: firebase_id });
        if (!statusDoc) {
            return res.status(404).send('Firebase ID not found.');
        }

        // Check if the status entry exists
        const statusIndex = statusDoc.statuses.findIndex(status => status.id === status_id);
        if (statusIndex === -1) {
            return res.status(404).send('Status ID not found.');
        }

        // Remove the status entry from the array
        statusDoc.statuses.splice(statusIndex, 1);

        await statusDoc.save();
        res.send({ message: 'Status entry deleted successfully.' });
    } catch (error) {
        res.status(500).send('An error occurred while deleting the status.');
    }
});





module.exports = router;