import express, { Express, Request, Response } from "express";

require("dotenv").config();

const app: Express = express();
const port = 8800;
import cors from "cors";
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

import bodyParser from "body-parser";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

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
