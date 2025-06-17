"use strict";

const router = require("express").Router();

router.get('/', (req, res) => {
  // Sends a simple JSON message as a response
  res.json({
    message: "Welcome to the P.B.API Blog!",
    version: "v1.0",
    status: true
  });
});

module.exports = router;