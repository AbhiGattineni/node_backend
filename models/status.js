const mongoose = require('mongoose');

// Schema for the individual status entries
const statusEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    department: {
        type: String,
    },
    role: {
        type: String,
    },
    student_group: {
        type: Number,
    },
    shared_applications: {
        type: Number,
    },
    searched_applications: {
        type: Number,
    },
    easy_apply: {
        type: Number,
    },
    connect_messages: {
        type: Number,
    },
    recruiter_messages: {
        type: Number,
    },
    type: {
        type: String,
        enum: ['part time student applications', 'full time student applications', 'intern', 'admin']
    },
    status: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000
    }
});

// Main Status schema
const StatusSchema = new mongoose.Schema({
    firebase_id: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    statuses: [statusEntrySchema] // Array of status entries
});

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;
