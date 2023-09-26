import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const database = require("../ultils/database");
const app: Express = express();

const router = express.Router();

//Get all coaches:
router.get("/", async (req: Request, res: Response) => {
  try {
    let allCoaches = await database.execute(
      "SELECT * FROM hanniefitness.coaches order by uploadDate ASC"
    );
    let [coaches] = allCoaches;

    res.status(200).json({
      status: "success",
      message: "Get all coaches successfully",
      data: coaches,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving coaches failed!",
      data: error,
    });
  }
});

//Add more coaches:
router.post("/add-coach", async (req: Request, res: Response) => {
  const { coachImage, coachName, intro, major } = req.body;
  const coachId = uuidv4();

  try {
    let newCoach = await database.execute(
      `INSERT INTO hanniefitness.coaches (coachId, coachImage, coachName, intro, major) VALUES ('${coachId}', '${coachImage}', '${coachName}', '${intro}', '${major}')`
    );

    res.status(200).json({
      status: "success",
      message: "Add coaches successfully",
      data: newCoach,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Adding coaches failed!",
      data: error,
    });
  }
});

//Delete a coach:
router.delete("/delete-coach/:coachId", async (req: Request, res: Response) => {
  const { coachId } = req.params;
  console.log("delete coachId-->", coachId);

  try {
    let deletedCoach = await database.execute(
      `DELETE FROM hanniefitness.coaches WHERE coachId = "${coachId}"`
    );

    res.status(200).json({
      status: "success",
      message: "Deleted coach successfully",
      data: deletedCoach,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Deleting coach failed!",
      error: error,
    });
  }
});

//Update a coach:
router.put("/update-coach/:coachId", async (req: Request, res: Response) => {
  const { coachId } = req.params;
  const { coachName, coachImage, intro, major } = req.body;

  try {
    console.log("check server update coach-->");
    let updatedCoach = await database.execute(
      `UPDATE hanniefitness.coaches SET coachName = "${coachName}", coachImage = "${coachImage}", intro = "${intro}", major = "${major}" WHERE coachId = "${coachId}"`
    );

    res.status(200).json({
      status: "success",
      message: "Updated coach successfully",
      data: updatedCoach,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "Updating coach failed!",
      data: error,
    });
  }
});

module.exports = router;
