import express, { Express } from "express";
import { RecordData } from "../types/record.type";
import recordController from "../controllers/record.controller";
import { verifyAdmin } from "../utils/auth";

const recordRouter = (app: Express) => {
    const router = express.Router();
    const adminRouter = express.Router();
    adminRouter.use(verifyAdmin);

    // Create a new Record
    router.post("/create", recordController.create);

    // Retrieve all Records
    router.get("/", recordController.findAll);

    // Retrieve one Record with rid
    adminRouter.get("/get/:rid", recordController.findByPk);
    
    // Retrieve all Records of a Player with pid
    router.get("/from/:pid", recordController.findAllAndCount );

    // Update a Record with id
    adminRouter.put("/update/:rid", recordController.update);

    // Delete a Player with id
    adminRouter.delete("/delete/:rid", recordController.delete);


    app.use("/api/records", router);
}

export default recordRouter;