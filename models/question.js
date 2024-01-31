const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000
    },
    ans_options: {
        type: [String], // Specify the type as an array of strings
        required: true  // Make it required
    },
    que_type: {
        type: String,
        required: true, 
        enum: ['text', 'radio', 'checkbox']
    },
    que_for: {
        type: String,
        enum: ['ACS part timer questions']
    },
    answer: {
        type: String,
        required: true,
        maxlength: 5000              //if it is a multi select, then merge them and search in answer string.
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;