import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const database = require("../ultils/database");
const app: Express = express();

const router = express.Router();

//Get all classes:
router.get("/", async (req: Request, res: Response) => {
  try {
    let allClasses = await database.execute(
      "select cl.classId, cl.classImage, cl.className, cl.classTime, cl.slots, cl.classInfo, cl.price, ch.coachImage, ch.coachName, ch.major from classes as cl join coaches as ch  on cl.coachId = ch.coachId"
    );
    let [classes] = allClasses;

    res.status(200).json({
      status: "success",
      message: "Get all classes successfully",
      data: classes,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving classes failed!",
      data: error,
    });
  }
});

//Add new class:
router.post("/add-class", async (req: Request, res: Response) => {
  const { className, classImage, classInfo, classTime, coachId, slots, price } =
    req.body;

  const classId = uuidv4();

  try {
    let newClass =
      await database.execute(`INSERT INTO hanniefitness.classes (classId, className, classImage, classInfo, classTime, coachId, slots, price)
    SELECT '${classId}', '${className}', '${classImage}', '${classInfo}', '${classTime}', '${coachId}', '${slots}', ${price}
    FROM hanniefitness.coaches
    WHERE coachId = '${coachId}'`);

    res.status(200).json({
      status: "success",
      message: "Added new class successfully",
      data: newClass,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Adding new class failed!",
      data: error,
    });
  }
}); //Delete a class:
router.delete("/delete-class/:classId", async (req: Request, res: Response) => {
  const { classId } = req.params;

  try {
    let deletedClass = await database.execute(
      `DELETE FROM hanniefitness.classes WHERE classId = '${classId}'`
    );

    res.status(200).json({
      status: "success",
      message: "Deleted class successfully",
      data: deletedClass,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Deleting class failed!",
      data: error,
    });
  }
});

//Update a class:
router.put("/update-class/:classId", async (req: Request, res: Response) => {
  const { classId } = req.params;
  const { className, classImage, classInfo, classTime, coachId, slots, price } =
    req.body;

  try {
    let updatedClass = await database.execute(
      `UPDATE hanniefitness.classes SET className = '${className}', classImage = '${classImage}', classInfo = "${classInfo}", classTime = '${classTime}', coachId = '${coachId}', slots = ${slots}, price = ${price} WHERE classId = '${classId}'`
    );

    res.status(200).json({
      status: "success",
      message: "Updated class successfully",
      data: updatedClass,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Updating class failed!",
      data: error,
    });
  }
});
module.exports = router;
