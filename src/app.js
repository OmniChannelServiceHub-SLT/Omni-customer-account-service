const express = require('express');
const getUserInfoRoutes = require('./APIs/GetUserInfo/routes/getUserInfo.route');


const app = express();

// Middleware (JSON, logger, etc.)
app.use(express.json());

// Mount the routes – note: the route files already include the full paths
app.use('/', getUserInfoRoutes);
// ... mount other API routes

// Global error handler (must handle TMF error format for CTK)
//app.use(require('./common/middleware/errorHandler'));

module.exports = app;