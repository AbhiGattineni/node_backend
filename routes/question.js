const mongoose = require('mongoose');
const express = require('express');

const { validateQuestionFor, validateQuestion } = require('./validations');
const Question = require('../models/question');

const router = express.Router();

//call to fetch all the questions
router.get('/:queFor', validateQuestionFor, async (req, res) => {
    const queFor = req.params.queFor;
    console.log(queFor);
    try {
        let query = await Question.find();

        if (query.length === 0)
            return res.status(404).send('No records exist.');

        res.send(query);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('An error occurred while fetching questions.');
    }
});

//call to post a new question
router.post('/', validateQuestion, async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).send(newQuestion);
    } catch (error) {
        console.error('Error saving the question:', error);
        res.status(500).send(`An error occurred while saving the question.${error}`);
    }
});



module.exports = router;

