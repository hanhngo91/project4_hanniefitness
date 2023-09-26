import { Request, Response } from "express";

//Middleware to check if the input is empty or not:
export enum Status {
  Success = "success",
  Fail = "fail",
}

const checkIsEmpty = (field: string) => {
  if (field === undefined || field === null || field === "") {
    return true;
  } else {
    return false;
  }
};

export const checkInput = (
  req: Request,
  res: Response,
  next: Function
): any => {
  const { userName, email, password }: any = req.body;

  if (userName) {
    if (checkIsEmpty(userName)) {
      return res.status(404).json({
        message: "Username can't be empty!",
        status: Status.Fail,
      });
    }

    if (checkIsEmpty(email)) {
      return res.status(404).json({
        message: "Email can't be empty!",
        status: Status.Fail,
      });
    }

    if (checkIsEmpty(password)) {
      return res.status(404).json({
        message: "Password can't be empty!",
        status: Status.Fail,
      });
    }
  } else {
    if (checkIsEmpty(email)) {
      return res.status(404).json({
        message: "Email can't be empty!",
        status: Status.Fail,
      });
    }

    if (checkIsEmpty(password)) {
      return res.status(404).json({
        message: "Password can't be empty!",
        status: Status.Fail,
      });
    }
  }

  next();
};

//Middleware validate email:
export const validateEmail = (req: Request, res: Response, next: Function) => {
  console.log("222222");
  const { email } = req.body;
  let emailPattern = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/; //Email has to be in format: abc@xyz.com
  if (!emailPattern.test(email)) {
    return res.status(404).json({
      message: "Email is invalid!",
      status: Status.Fail,
    });
  }
  next();
};

//Middleware validate password:
export const validatePassword = (
  req: Request,
  res: Response,
  next: Function
) => {
  const { password } = req.body;
  let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; //Password has to be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
  if (!passwordPattern.test(password)) {
    return res.status(404).json({
      message:
        "Password needs at least 8 characters, 1 uppercase, 1 lowercase and 1 number!",
      status: Status.Fail,
    });
  }
  next();
};
module.exports = { checkInput, validateEmail, validatePassword };
