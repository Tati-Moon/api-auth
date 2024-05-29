const express = require('express');
const userController = require('../controllers/user.controller.js');
const { authJwt } = require("../middleware");

const userRoutes = () => {
    const router = express.Router();
    let asd;

    // TODO The rest should be opened only for userorized users.

     // Create a new Tutorial
// router.post("/", userController.create);

    // Retrieve all Tutorials
    router.get('/', userController.findAll);

    // Retrieve random page.
    router.get('/random', userController.findRandomPage);

    // Retrieve a single Tutorial with id
    router.get('/:id', userController.findOne);

    // Update a Tutorial with id
     router.put("/:id", userController.update);

     // Deactivation/activation a Tutorial with id
     router.put("/:id", userController.toggleActivation);


     router.get("/api/test/all", userController.allAccess);

     router.get(
       "/api/test/user",
       [authJwt.verifyToken],
       userController.userBoard
     );
   
     router.get(
       "/api/test/mod",
       [authJwt.verifyToken, authJwt.isModerator],
       userController.moderatorBoard
     );
   
     router.get(
       "/api/test/admin",
       [authJwt.verifyToken, authJwt.isAdmin],
       userController.adminBoard
     );

    return router;
};

module.exports = userRoutes;
