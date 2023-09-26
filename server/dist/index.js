"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const app = (0, express_1.default)();
const port = 8800;
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
//Import users routes:
const usersRoutes = require("./routes/users.routes");
//Use users routes:
app.use("/data/users", usersRoutes);
//Import coaches routes:
const coachesRoutes = require("./routes/coaches.routes");
//Use coaches routes:
app.use("/data/coaches", coachesRoutes);
//Import classes routes:
const classesRoutes = require("./routes/classes.routes");
//Use classes routes:
app.use("/data/classes", classesRoutes);
//Import images routes:
const imagesRoutes = require("./routes/upload.routes");
//Use images routes:
app.use("/data/upload", imagesRoutes);
//Import cart routes:
const cartRoutes = require("./routes/reservation.routes");
//Use cart routes:
app.use("/cart", cartRoutes);
app.listen(port, () => {
    console.log(`⚡️ Server is running at http://localhost:${port}`);
});
