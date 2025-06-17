"use strict";
const home = require("./home");
const blogRoutes = require("./blog");
const userRoutes = require("./user");

module.exports = (app) => {
    
    app.use("/", home);
    
    app.use("/v1/blog", blogRoutes);
    
    app.use("/v1/users", userRoutes);
};
