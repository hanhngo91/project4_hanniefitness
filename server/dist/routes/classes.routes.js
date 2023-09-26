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
//Get all classes:
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allClasses = yield database.execute("select cl.classId, cl.classImage, cl.className, cl.classTime, cl.slots, cl.classInfo, cl.price, ch.coachImage, ch.coachName, ch.major from classes as cl join coaches as ch  on cl.coachId = ch.coachId");
        let [classes] = allClasses;
        res.status(200).json({
            status: "success",
            message: "Get all classes successfully",
            data: classes,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving classes failed!",
            data: error,
        });
    }
}));
//Add new class:
router.post("/add-class", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { className, classImage, classInfo, classTime, coachId, slots, price } = req.body;
    const classId = (0, uuid_1.v4)();
    try {
        let newClass = yield database.execute(`INSERT INTO hanniefitness.classes (classId, className, classImage, classInfo, classTime, coachId, slots, price)
    SELECT '${classId}', '${className}', '${classImage}', '${classInfo}', '${classTime}', '${coachId}', '${slots}', ${price}
    FROM hanniefitness.coaches
    WHERE coachId = '${coachId}'`);
        res.status(200).json({
            status: "success",
            message: "Added new class successfully",
            data: newClass,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Adding new class failed!",
            data: error,
        });
    }
})); //Delete a class:
router.delete("/delete-class/:classId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId } = req.params;
    try {
        let deletedClass = yield database.execute(`DELETE FROM hanniefitness.classes WHERE classId = '${classId}'`);
        res.status(200).json({
            status: "success",
            message: "Deleted class successfully",
            data: deletedClass,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Deleting class failed!",
            data: error,
        });
    }
}));
//Update a class:
router.put("/update-class/:classId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { classId } = req.params;
    const { className, classImage, classInfo, classTime, coachId, slots, price } = req.body;
    try {
        let updatedClass = yield database.execute(`UPDATE hanniefitness.classes SET className = '${className}', classImage = '${classImage}', classInfo = "${classInfo}", classTime = '${classTime}', coachId = '${coachId}', slots = ${slots}, price = ${price} WHERE classId = '${classId}'`);
        res.status(200).json({
            status: "success",
            message: "Updated class successfully",
            data: updatedClass,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Updating class failed!",
            data: error,
        });
    }
}));
module.exports = router;
