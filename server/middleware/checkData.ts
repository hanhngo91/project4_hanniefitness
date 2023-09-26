import { Request, Response } from "express";
const database = require("../ultils/database");

export enum Status {
  Success = "success",
  Fail = "fail",
}

//Middleware to check if email is already registered:
export const checkEmail = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { email }: any = req.body;

  try {
    let existedEmail = await database.execute(
      `select * from hanniefitness.users where email = "${email}"`
    );

    if (existedEmail[0].length > 0) {
      return res.status(404).json({
        message: "Email has been registered!",
        status: Status.Fail,
      });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).json({
      message: "[email] Server error",
      status: Status.Fail,
    });
  }
};

//Middleware to check if username is already registered:
export const checkUsername = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { userName }: any = req.body;

  try {
    if (userName) {
      let existedUsername = await database.execute(
        `SELECT * FROM hanniefitness.users WHERE userName = "${userName}"`
      );
      if (existedUsername[0].length > 0) {
        return res.status(404).json({
          message: "Username has been registered!",
          status: Status.Fail,
        });
      } else {
        next();
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "[userName] Server error",
      status: Status.Fail,
    });
  }
};

module.exports = { checkEmail, checkUsername };
