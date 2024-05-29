const express = require('express');

const testRoutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.json({message: 'Test Auth!'});
    });

    return router;
};
module.exports = testRoutes;
