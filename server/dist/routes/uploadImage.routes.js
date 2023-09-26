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
const database_1 = __importDefault(require("../ultils/database"));
const router = express_1.default.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Lưu file vào thư mục public/images
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        // Lấy phần tử sau dấu chấm của tên file
        let ext = file.originalname.split(".")[1];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
// Giới hạn kích thước file upload là 10MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 2); // "images" là tên trường cho các hình ảnh, và 2 là số lượng tối đa các tệp được phép tải lên
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, function (err) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = req.files.map((file) => `http://localhost:8800/images/${file.filename}`);
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    message: "Failed to upload",
                    error: err.message,
                });
            }
            else if (err) {
                return res.status(400).json({
                    message: "Failed to upload",
                    error: err.message,
                });
            }
            const { productId } = req.body;
            try {
                console.log(images);
                for (let i = 0; i < images.length; i++) {
                    // Thực hiện câu lệnh SQL để lưu URL của ảnh vào bảng images
                    yield database_1.default.execute(`INSERT INTO shopee.images (image, productId) VALUES (?, ?)`, [images[i], 14]);
                }
                res.json({
                    status: "Success",
                });
            }
            catch (error) {
                console.log("Insert failed", error);
                return res.status(500).json({
                    status: 500,
                    message: "Failed",
                    error: error.message,
                });
            }
        });
    });
}));
exports.default = router;
