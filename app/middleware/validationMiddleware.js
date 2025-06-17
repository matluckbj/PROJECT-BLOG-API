"use strict";

const { validate } = require("../utils/helpers");

const validationMiddleware = (schema, property = 'body') => {
    return (req, res, next) => {
        const payload = req[property];

        const error = validate(schema, payload);

        if (error) {
            console.error(`Validation Error (${property}):`, error);
            return res.status(400).json({
                message: error, 
            });
        }
        
        next();
    };
};

module.exports = validationMiddleware;