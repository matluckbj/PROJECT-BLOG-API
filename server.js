"use strict";
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
require("dotenv").config({}); 
const { StatusCodes } = require("http-status-codes");

require("./app/database/db");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

require("./routes")(app);


app.use((err, req, res, next) => {
    return res.status (err.status || StatusCodes.NOT_FOUND)
        .json({error: err.message});
});


app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status (err.status || StatusCodes.INTERNAL_SERVER_ERROR)
     .json({error: err.message});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
