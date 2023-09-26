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
//Get reserveCart:
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        let reserveCart = yield database.execute(`SELECT cl.classId, cl.classImage, cl.className, cl.classTime, cl.slots, cl.price, re.userId, re.classId, re.createdDate
      FROM hanniefitness.classes as cl join hanniefitness.reserveCart as re on re.classId = cl.classId WHERE re.userId = "${userId}" ORDER BY re.createdDate ASC`);
        let [cartData] = reserveCart;
        res.status(200).json({
            status: "success",
            message: "Get reserveCart successfully",
            data: cartData,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving reserveCart failed!",
            data: err,
        });
    }
}));
//Add to cart:
router.post("/addToCart", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, classId } = req.body;
    const reserveCartId = (0, uuid_1.v4)();
    try {
        yield database.execute(`INSERT INTO hanniefitness.reserveCart (reserveCartId, userId, classId) VALUES ("${reserveCartId}", "${userId}", "${classId}")`);
        return res.status(200).json({
            status: "success",
            message: "Added to cart successfully",
            classId: classId,
            userId: userId,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: "fail",
            message: "Adding to cart failed!",
            data: err,
        });
    }
}));
//Remove item from cart:
router.delete("/removeFromCart/:userId/:classId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, classId } = req.params;
    try {
        yield database.execute(`DELETE FROM hanniefitness.reserveCart 
        WHERE userId = "${userId}" AND classId = "${classId}"`);
        res.status(200).json({
            status: "success",
            message: "Remove from cart successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Removing from cart failed!",
            data: err,
        });
    }
}));
//Check out:
router.post("/checkOut", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, classIds, total } = req.body;
    const reservationsId = (0, uuid_1.v4)();
    const reservationdetailsId = (0, uuid_1.v4)();
    try {
        yield database.execute(`DELETE FROM hanniefitness.reserveCart WHERE userId = "${userId}"`);
        yield database.execute(`INSERT INTO hanniefitness.reservations (reservationsId, userId, total) VALUES ("${reservationsId}", "${userId}", ${total})`);
        for (let i = 0; i < classIds.length; i++) {
            yield database.execute(`INSERT INTO hanniefitness.reservationdetails 
      (reservationdetailsId, userId, classId, reservationsId) 
      VALUES ("${reservationdetailsId}${classIds[i]}", "${userId}", "${classIds[i]}", "${reservationsId}")`);
            yield database.execute(`UPDATE hanniefitness.classes SET slots = slots - 1 WHERE classId = "${classIds[i]}"`);
        }
        res.status(200).json({
            status: "success",
            message: "Check out successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Checking out failed!",
            data: err,
        });
    }
}));
//Get all reservations of a user:
router.get("/reservations/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        let reservations = yield database.execute(`SELECT * FROM hanniefitness.reservations WHERE userId = "${userId}" ORDER BY createdDate ASC`);
        let [reservationData] = reservations;
        res.status(200).json({
            status: "success",
            message: "Get reservations for user successfully",
            data: reservationData,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving reservations for user failed!",
            data: err,
        });
    }
}));
//Get all reservation details of all user:
router.get("/reservationDetails/:reservationsId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationsId } = req.params;
    try {
        let reservationDetails = yield database.execute(`select cl.classId, cl.classImage, cl.className, cl.classTime, cl.price, re.reservationDetailsId, re.createdDate
        from classes as cl
        join reservationdetails as re
        on cl.classId = re.classId 
        WHERE re.reservationsId = "${reservationsId}" ORDER BY re.createdDate ASC`);
        let [reservationDetailsData] = reservationDetails;
        res.status(200).json({
            status: "success",
            message: "Get reservation details successfully",
            data: reservationDetailsData,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving reservation details failed!",
            data: err,
        });
    }
}));
//Get reservation details from an user:
router.get("/reservationDetails/:reservationsId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationsId } = req.params;
    try {
        let reservationDetails = yield database.execute(`select cl.classId, cl.classImage, cl.className, cl.classTime, cl.price, re.reservationDetailsId, re.createdDate
        from classes as cl
        join reservationdetails as re
        on cl.classId = re.classId
        WHERE reservationsId = "${reservationsId}"`);
        let [reservationDetailsData] = reservationDetails;
        res.status(200).json({
            status: "success",
            message: "Get reservation details successfully",
            data: reservationDetailsData,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving reservation details failed!",
            data: err,
        });
    }
}));
//Get all reservations for admin page:
router.get("/all/all-reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reservations = yield database.execute(`select us.userId, us.userName, us.email, re.reservationsId, re.createdDate, re.total, re.reservationStatus
      from users as us
      join reservations as re
      on us.userId = re.userId
      ORDER BY re.createdDate ASC`);
        let [reservationData] = reservations;
        res.status(200).json({
            status: "success",
            message: "Get all reservations successfully",
            data: reservationData,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "fail",
            message: "Retrieving all reservations failed!",
            data: err,
        });
    }
}));
module.exports = router;
