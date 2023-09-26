import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const database = require("../ultils/database");
const app: Express = express();

const router = express.Router();

//Get reserveCart:
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    let reserveCart = await database.execute(
      `SELECT cl.classId, cl.classImage, cl.className, cl.classTime, cl.slots, cl.price, re.userId, re.classId, re.createdDate
      FROM hanniefitness.classes as cl join hanniefitness.reserveCart as re on re.classId = cl.classId WHERE re.userId = "${userId}" ORDER BY re.createdDate ASC`
    );

    let [cartData] = reserveCart;
    res.status(200).json({
      status: "success",
      message: "Get reserveCart successfully",
      data: cartData,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving reserveCart failed!",
      data: err,
    });
  }
});

//Add to cart:
router.post("/addToCart", async (req: Request, res: Response) => {
  const { userId, classId } = req.body;
  const reserveCartId = uuidv4();
  try {
    await database.execute(
      `INSERT INTO hanniefitness.reserveCart (reserveCartId, userId, classId) VALUES ("${reserveCartId}", "${userId}", "${classId}")`
    );
    return res.status(200).json({
      status: "success",
      message: "Added to cart successfully",
      classId: classId,
      userId: userId,
    });
  } catch (err: any) {
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: "Adding to cart failed!",
      data: err,
    });
  }
});

//Remove item from cart:
router.delete(
  "/removeFromCart/:userId/:classId",
  async (req: Request, res: Response) => {
    const { userId, classId } = req.params;

    try {
      await database.execute(
        `DELETE FROM hanniefitness.reserveCart 
        WHERE userId = "${userId}" AND classId = "${classId}"`
      );

      res.status(200).json({
        status: "success",
        message: "Remove from cart successfully",
      });
    } catch (err: any) {
      res.status(500).json({
        status: "fail",
        message: "Removing from cart failed!",
        data: err,
      });
    }
  }
);

//Check out:
router.post("/checkOut", async (req: Request, res: Response) => {
  const { userId, classIds, total } = req.body;

  const reservationsId = uuidv4();
  const reservationdetailsId = uuidv4();

  try {
    await database.execute(
      `DELETE FROM hanniefitness.reserveCart WHERE userId = "${userId}"`
    );
    await database.execute(
      `INSERT INTO hanniefitness.reservations (reservationsId, userId, total) VALUES ("${reservationsId}", "${userId}", ${total})`
    );
    for (let i = 0; i < classIds.length; i++) {
      await database.execute(`INSERT INTO hanniefitness.reservationdetails 
      (reservationdetailsId, userId, classId, reservationsId) 
      VALUES ("${reservationdetailsId}${classIds[i]}", "${userId}", "${classIds[i]}", "${reservationsId}")`);
      await database.execute(
        `UPDATE hanniefitness.classes SET slots = slots - 1 WHERE classId = "${classIds[i]}"`
      );
    }

    res.status(200).json({
      status: "success",
      message: "Check out successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: "Checking out failed!",
      data: err,
    });
  }
});

//Get all reservations of a user:
router.get("/reservations/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    let reservations = await database.execute(
      `SELECT * FROM hanniefitness.reservations WHERE userId = "${userId}" ORDER BY createdDate ASC`
    );
    let [reservationData] = reservations;
    res.status(200).json({
      status: "success",
      message: "Get reservations for user successfully",
      data: reservationData,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving reservations for user failed!",
      data: err,
    });
  }
});

//Get all reservation details of all user:
router.get(
  "/reservationDetails/:reservationsId",
  async (req: Request, res: Response) => {
    const { reservationsId } = req.params;
    try {
      let reservationDetails = await database.execute(
        `select cl.classId, cl.classImage, cl.className, cl.classTime, cl.price, re.reservationDetailsId, re.createdDate
        from classes as cl
        join reservationdetails as re
        on cl.classId = re.classId 
        WHERE re.reservationsId = "${reservationsId}" ORDER BY re.createdDate ASC`
      );
      let [reservationDetailsData] = reservationDetails;
      res.status(200).json({
        status: "success",
        message: "Get reservation details successfully",
        data: reservationDetailsData,
      });
    } catch (err: any) {
      res.status(500).json({
        status: "fail",
        message: "Retrieving reservation details failed!",
        data: err,
      });
    }
  }
);

//Get reservation details from an user:
router.get(
  "/reservationDetails/:reservationsId",
  async (req: Request, res: Response) => {
    const { reservationsId } = req.params;
    try {
      let reservationDetails = await database.execute(
        `select cl.classId, cl.classImage, cl.className, cl.classTime, cl.price, re.reservationDetailsId, re.createdDate
        from classes as cl
        join reservationdetails as re
        on cl.classId = re.classId
        WHERE reservationsId = "${reservationsId}"`
      );
      let [reservationDetailsData] = reservationDetails;
      res.status(200).json({
        status: "success",
        message: "Get reservation details successfully",
        data: reservationDetailsData,
      });
    } catch (err: any) {
      res.status(500).json({
        status: "fail",
        message: "Retrieving reservation details failed!",
        data: err,
      });
    }
  }
);

//Get all reservations for admin page:
router.get("/all/all-reservations", async (req: Request, res: Response) => {
  try {
    let reservations = await database.execute(
      `select us.userId, us.userName, us.email, re.reservationsId, re.createdDate, re.total, re.reservationStatus
      from users as us
      join reservations as re
      on us.userId = re.userId
      ORDER BY re.createdDate ASC`
    );
    let [reservationData] = reservations;

    res.status(200).json({
      status: "success",
      message: "Get all reservations successfully",
      data: reservationData,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: "Retrieving all reservations failed!",
      data: err,
    });
  }
});

module.exports = router;
