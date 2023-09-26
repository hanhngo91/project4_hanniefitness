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
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Save in public/images
        cb(null, `${__dirname}/../public/images`);
    },
    filename: function (req, file, cb) {
        //Get file extension:
        let ext = file.originalname.split(".")[1];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
//Limit file size: 10MB for coach image:
const coachImage = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).single("coachImage");
router.post("/coach-image", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    coachImage(req, res, function (err) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("check req.file--> ");
            if (err instanceof multer_1.default.MulterError) {
                return res.status(500).json(err);
            }
            else if (err) {
                return res.status(500).json(err);
            }
            else {
                try {
                    const imgPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                    const imgUrl = `http://localhost:8800/images/${imgPath}`;
                    return res.status(201).send({
                        status: 201,
                        url: imgUrl,
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    });
}));
module.exports = router;
