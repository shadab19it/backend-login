import User from "../models/user";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import { IUser } from "../models/user";

interface ReqUser {
  name: string;
  email: string;
  password: string;
}

// SignUp
export const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg, input: errors.array()[0].param });
  }

  const user = new User(req.body);
  user.save((err, u: IUser) => {
    if (err) {
      return res.status(400).res.json({ err: "user not save in db" });
    }
    return res.json({
      name: u.name,
      email: u.email,
      id: u._id,
    });
  });
};

// SignIn
export const signin = (req, res) => {
  const { email, password } = req.body;

  // Validator Check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).res.json({ err: errors.array()[0].msg });
  }

  // find User by Email
  User.findOne({ email }, (err, u) => {
    if (err || !u) {
      res.status(400).res.json({ error: "User's email does not exist !" });
    }

    if (!u.authenticate(password)) {
      return res.status(401).res.json({ err: "Email and Password does not match" });
    }

    // create token
    const token = jwt.sign({ _id: u._id }, process.env.SECRET);

    // put token in  cookie
    res.cookie("token", token, { expire: new Date() + "9999" });

    // send res to frontend
    const { name, email } = u;
    return res.json({ token, user: { name, email }, message: "You are successfully login" });
  });
};

// signout
export const signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User SignOut sussesfully",
  });
};

// Checking is SignIn or not

export const isSignIn = expressJwt({
  secret: process.env.SECRET,
  requestProperty: "AuthO",
  algorithms: ["HS256"],
});
