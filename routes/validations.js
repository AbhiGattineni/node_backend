const Joi = require('joi');

// Middleware for validating Firebase ID
const validateFirebaseId = (req, res, next) => {
    const schema = Joi.object({
        firebase_id: Joi.string().alphanum().required() // Adjust the length or pattern as needed
    });

    const { error } = schema.validate({ firebase_id: req.params.firebase_id });

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

// Middleware for validating status update
const validateUpdateStatus = (req, res, next) => {
    const schema = Joi.object({
        student_group: Joi.number().optional(),
        status_type: Joi.string().valid('part time student applications', 'full time student applications', 'intern', 'admin').optional(),
        status: Joi.string().min(5).max(5000).optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

// Middleware for validating question for
const validateQuestionFor = (req, res, next) => {
    const schema = Joi.object({
        queFor: Joi.string().valid('ACS part timer questions').required()
    });

    const { error } = schema.validate({ queFor: req.params.queFor });

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

// Middleware for validating question
const validateQuestion = (req, res, next) => {

    const questionSchema = Joi.object({
        question: Joi.string().min(5).max(5000).required(),
        ans_options: Joi.array().items(Joi.string()).required(),
        que_type: Joi.string().valid('text', 'radio', 'checkbox').required(),
        que_for: Joi.string().valid('ACS part timer questions').required(),
        answer: Joi.string().max(5000).required()
    });
    const { error } = questionSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};


module.exports = { validateFirebaseId, validateUpdateStatus, validateQuestionFor, validateQuestion};