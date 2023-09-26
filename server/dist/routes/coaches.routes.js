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
const database = require("../ultils/database");
const app = (0, express_1.default)();
const router = express_1.default.Router();
//Get all coaches:
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allCoaches = yield database.execute("SELECT * FROM hanniefitness.coaches order by uploadDate ASC");
        let [coaches] = allCoaches;
        res.status(200).json({
            status: "success",
            message: "Get all coaches successfully",
            data: coaches,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving coaches failed!",
            data: error,
        });
    }
}));
//Add more coaches:
router.post("/add-coach", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coachImage, coachName, intro, major } = req.body;
    const coachId = (0, uuid_1.v4)();
    try {
        let newCoach = yield database.execute(`INSERT INTO hanniefitness.coaches (coachId, coachImage, coachName, intro, major) VALUES ('${coachId}', '${coachImage}', '${coachName}', '${intro}', '${major}')`);
        res.status(200).json({
            status: "success",
            message: "Add coaches successfully",
            data: newCoach,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Adding coaches failed!",
            data: error,
        });
    }
}));
//Delete a coach:
router.delete("/delete-coach/:coachId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coachId } = req.params;
    console.log("delete coachId-->", coachId);
    try {
        let deletedCoach = yield database.execute(`DELETE FROM hanniefitness.coaches WHERE coachId = "${coachId}"`);
        res.status(200).json({
            status: "success",
            message: "Deleted coach successfully",
            data: deletedCoach,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Deleting coach failed!",
            error: error,
        });
    }
}));
//Update a coach:
router.put("/update-coach/:coachId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coachId } = req.params;
    const { coachName, coachImage, intro, major } = req.body;
    try {
        console.log("check server update coach-->");
        let updatedCoach = yield database.execute(`UPDATE hanniefitness.coaches SET coachName = "${coachName}", coachImage = "${coachImage}", intro = "${intro}", major = "${major}" WHERE coachId = "${coachId}"`);
        res.status(200).json({
            status: "success",
            message: "Updated coach successfully",
            data: updatedCoach,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Updating coach failed!",
            data: error,
        });
    }
}));
module.exports = router;
