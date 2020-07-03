import express from "express";
import { check } from "express-validator";
import { signup, signin, signout, isSignIn } from "../controllers/auth";
const router = express.Router();

// SignUp
router.post(
  "/signup",
  [
    check("password").isLength({ min: 5 }).withMessage("password must be at least 5 chars long"),
    check("name").isLength({ min: 5 }).withMessage("UserName must be at least 5 chars long"),
    check("email", "Email is Required").isLength({ min: 5 }),
  ],
  signup
);

// SignIn
router.post(
  "/signin",
  [check("email").isEmail().withMessage("Email is Required"), check("password").isLength({ min: 5 }).withMessage("Password is Required")],
  signin
);

// SignOut
router.get("/signout", signout);

router.get("/testroute", isSignIn, (req, res) => {
  res.send("this is protected routes");
});

export default router;
