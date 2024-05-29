const express = require('express');
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

const authRoutes = () => {
    const router = express.Router();

    router.post(
        "/signup",
        [
          verifySignUp.checkDuplicateUsernameOrEmail,
          verifySignUp.checkRolesExisted
        ],
        controller.signup
      );
    
      router.post("/signin", controller.signin);

    return router;
};

module.exports = authRoutes;
