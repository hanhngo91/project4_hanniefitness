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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const checkInput_1 = require("../middleware/checkInput");
const checkData_1 = require("../middleware/checkData");
const router = express_1.default.Router();
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
const database = require("../ultils/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//get all users:
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allUsers = yield database.execute("SELECT * FROM hanniefitness.users");
        let [users] = allUsers;
        res.status(200).json({
            status: "success",
            message: "Get all users successfully",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving users failed!",
            data: error,
        });
    }
}));
//Sign up:
router.post("/signup", checkInput_1.checkInput, checkInput_1.validateEmail, checkInput_1.validatePassword, checkData_1.checkEmail, checkData_1.checkUsername, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    const userId = (0, uuid_1.v4)();
    const hashed_password = yield bcrypt.hash(password, 10);
    const sanitizedEmail = email.toLowerCase();
    const sanitizedUserName = userName.toLowerCase().trim();
    try {
        yield database.execute(`INSERT INTO hanniefitness.users (userId, userName, email, hashed_password) VALUES ('${userId}', "${sanitizedUserName}", '${sanitizedEmail}', '${hashed_password}')`);
        const token = jwt.sign({ userId: userId, email: sanitizedEmail }, process.env.SECRET, { expiresIn: "24h" });
        res.status(200).json({
            status: "success",
            message: "Sign up successfully",
            token: token,
            userId: userId,
            userName: userName,
            email: sanitizedEmail,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Sign up failed!",
            data: error,
        });
    }
}));
//Log in:
router.post("/login", checkInput_1.checkInput, checkInput_1.validateEmail, checkInput_1.validatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const sanitizedEmail = email.toLowerCase();
    try {
        let user = yield database.execute(`SELECT * FROM hanniefitness.users WHERE email = '${sanitizedEmail}'`);
        let [users] = user;
        if (users.length === 0) {
            res.status(404).json({
                status: "fail",
                message: "Email hasn't been registered!",
            });
        }
        else {
            const validPassword = yield bcrypt.compare(password, users[0].hashed_password);
            if (validPassword) {
                const token = jwt.sign({ userId: users[0].userId, email: sanitizedEmail }, process.env.SECRET, { expiresIn: "24h" });
                res.status(200).json({
                    status: "success",
                    message: "Log in successfully",
                    token: token,
                    userId: users[0].userId,
                    userName: users[0].userName,
                    roles: users[0].roles,
                    email: sanitizedEmail,
                });
            }
            else {
                res.status(404).json({
                    status: "fail",
                    message: "Wrong password!",
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Log in failed due to server error!",
            data: error,
        });
    }
}));
//Delete a user:
router.delete("/delete-user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        let deleteUser = yield database.execute(`DELETE FROM hanniefitness.users WHERE userId = '${userId}'`);
        res.status(200).json({
            status: "success",
            message: "Delete user successfully",
            data: deleteUser,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Deleting user failed!",
            data: error,
        });
    }
}));
module.exports = router;
