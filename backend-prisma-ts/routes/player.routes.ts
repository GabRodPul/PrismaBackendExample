import express, { Express } from "express";
import playerController from "../controllers/player.controller";
import authController from "../controllers/auth.controller";
import { verifyAdmin } from "../utils/auth";

const playerRouter = (app: Express) => {
    const router = express.Router();
    const adminRouter = express.Router();
    adminRouter.use(verifyAdmin);

    // Create a new Player
    router.post("/create", playerController.create);
    router.post("/raw-create", playerController.create);

    // Retrieve all Players
    router.get("/", playerController.findAll);      // NA
    
    // Retrieve a single Player with either id or username
    adminRouter.get("/search/:username", (req, res) => playerController.findOne(req, res, true) );
    router.get("/:pid", playerController.findByPk); // NA

    // Update a Player with id
    router.put("/:pid", playerController.update);   // NA

    // Delete a Player with id
    adminRouter.delete("/delete/:pid", playerController.delete);
    router.post("/login", authController.login);
    router.post("/signin", authController.signin);


    app.use("/api/players", router);
    app.use("/api/players", adminRouter);
}

export default playerRouter;