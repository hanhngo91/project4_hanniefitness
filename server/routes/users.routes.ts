import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  checkInput,
  validateEmail,
  validatePassword,
} from "../middleware/checkInput";
import { checkEmail, checkUsername } from "../middleware/checkData";

const router = express.Router();

const app: Express = express();

import bodyParser from "body-parser";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const database = require("../ultils/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//get all users:
router.get("/", async (req: Request, res: Response) => {
  try {
    let allUsers = await database.execute("SELECT * FROM hanniefitness.users");
    let [users] = allUsers;

    res.status(200).json({
      status: "success",
      message: "Get all users successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving users failed!",
      data: error,
    });
  }
});

//Sign up:
router.post(
  "/signup",
  checkInput,
  validateEmail,
  validatePassword,
  checkEmail,
  checkUsername,
  async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;

    const userId = uuidv4();
    const hashed_password = await bcrypt.hash(password, 10);
    const sanitizedEmail = email.toLowerCase();
    const sanitizedUserName = userName.toLowerCase().trim();
    try {
      await database.execute(
        `INSERT INTO hanniefitness.users (userId, userName, email, hashed_password) VALUES ('${userId}', "${sanitizedUserName}", '${sanitizedEmail}', '${hashed_password}')`
      );
      const token = jwt.sign(
        { userId: userId, email: sanitizedEmail },
        process.env.SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        status: "success",
        message: "Sign up successfully",
        token: token,
        userId: userId,
        userName: userName,
        email: sanitizedEmail,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "fail",
        message: "Sign up failed!",
        data: error,
      });
    }
  }
);

//Log in:
router.post(
  "/login",
  checkInput,
  validateEmail,
  validatePassword,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const sanitizedEmail = email.toLowerCase();
    try {
      let user = await database.execute(
        `SELECT * FROM hanniefitness.users WHERE email = '${sanitizedEmail}'`
      );
      let [users] = user;
      if (users.length === 0) {
        res.status(404).json({
          status: "fail",
          message: "Email hasn't been registered!",
        });
      } else {
        const validPassword = await bcrypt.compare(
          password,
          users[0].hashed_password
        );
        if (validPassword) {
          const token = jwt.sign(
            { userId: users[0].userId, email: sanitizedEmail },
            process.env.SECRET,
            { expiresIn: "24h" }
          );
          res.status(200).json({
            status: "success",
            message: "Log in successfully",
            token: token,
            userId: users[0].userId,
            userName: users[0].userName,
            roles: users[0].roles,
            email: sanitizedEmail,
          });
        } else {
          res.status(404).json({
            status: "fail",
            message: "Wrong password!",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "Log in failed due to server error!",
        data: error,
      });
    }
  }
);

//Delete a user:
router.delete("/delete-user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    let deleteUser = await database.execute(
      `DELETE FROM hanniefitness.users WHERE userId = '${userId}'`
    );

    res.status(200).json({
      status: "success",
      message: "Delete user successfully",
      data: deleteUser,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Deleting user failed!",
      data: error,
    });
  }
});

module.exports = router;
