
import express, { Express } from "express";
import settingsController from "../controllers/settings.controller";
import authController from "../controllers/auth.controller";
import { verifyAdmin } from "../utils/auth";

const settingsRouter = (app: Express) => {
    const router = express.Router();
    const adminRouter = express.Router();
    adminRouter.use(verifyAdmin);

    // Create new Settings
    router.post("/create", settingsController.create);

    // Retrieve all Settings
    adminRouter.get("/", settingsController.findAll);
    
    // Retrieve a single Player with either id or username
    adminRouter.get("/:sid", settingsController.findOne);
    router.get("/from/:pid", settingsController.findByPk);

    // Update Settings with Player id
    router.put("/update/:pid", settingsController.update);

    // Delete a Player with id
    adminRouter.delete("/delete/:sid", settingsController.delete);


    app.use("/api/settings", router);
    app.use("/api/settings", adminRouter);
}

export default settingsRouter;