"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = exports.checkInput = exports.Status = void 0;
//Middleware to check if the input is empty or not:
var Status;
(function (Status) {
    Status["Success"] = "success";
    Status["Fail"] = "fail";
})(Status || (exports.Status = Status = {}));
const checkIsEmpty = (field) => {
    if (field === undefined || field === null || field === "") {
        return true;
    }
    else {
        return false;
    }
};
const checkInput = (req, res, next) => {
    const { userName, email, password } = req.body;
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
    }
    else {
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
exports.checkInput = checkInput;
//Middleware validate email:
const validateEmail = (req, res, next) => {
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
exports.validateEmail = validateEmail;
//Middleware validate password:
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; //Password has to be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
    if (!passwordPattern.test(password)) {
        return res.status(404).json({
            message: "Password needs at least 8 characters, 1 uppercase, 1 lowercase and 1 number!",
            status: Status.Fail,
        });
    }
    next();
};
exports.validatePassword = validatePassword;
module.exports = { checkInput: exports.checkInput, validateEmail: exports.validateEmail, validatePassword: exports.validatePassword };
