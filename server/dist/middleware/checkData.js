"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsername = exports.checkEmail = exports.Status = void 0;
const database = require("../ultils/database");
var Status;
(function (Status) {
    Status["Success"] = "success";
    Status["Fail"] = "fail";
})(Status || (exports.Status = Status = {}));
//Middleware to check if email is already registered:
const checkEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let existedEmail = yield database.execute(`select * from hanniefitness.users where email = "${email}"`);
        if (existedEmail[0].length > 0) {
            return res.status(404).json({
                message: "Email has been registered!",
                status: Status.Fail,
            });
        }
        else {
            next();
        }
    }
    catch (err) {
        return res.status(500).json({
            message: "[email] Server error",
            status: Status.Fail,
        });
    }
});
exports.checkEmail = checkEmail;
//Middleware to check if username is already registered:
const checkUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.body;
    try {
        if (userName) {
            let existedUsername = yield database.execute(`SELECT * FROM hanniefitness.users WHERE userName = "${userName}"`);
            if (existedUsername[0].length > 0) {
                return res.status(404).json({
                    message: "Username has been registered!",
                    status: Status.Fail,
                });
            }
            else {
                next();
            }
        }
    }
    catch (err) {
        return res.status(500).json({
            message: "[userName] Server error",
            status: Status.Fail,
        });
    }
});
exports.checkUsername = checkUsername;
module.exports = { checkEmail: exports.checkEmail, checkUsername: exports.checkUsername };
