import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    // Save in public/images
    cb(null, `${__dirname}/../public/images`);
  },
  filename: function (req: Request, file: any, cb: any) {
    //Get file extension:
    let ext = file.originalname.split(".")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

//Limit file size: 10MB for coach image:
const coachImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("coachImage");

router.post("/coach-image", async (req: Request, res: Response) => {
  coachImage(req, res, async function (err: any) {
    console.log("check req.file--> ");

    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      try {
        const imgPath = req.file?.filename;

        const imgUrl = `http://localhost:8800/images/${imgPath}`;
        return res.status(201).send({
          status: 201,
          url: imgUrl,
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});

module.exports = router;
