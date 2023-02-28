import express, { Express } from "express";
import { getRanking } from "../controllers/ranking.controller";

const rankingRouter = (app: Express) => {
    const router = express.Router();

    // Create a new Record
    router.get("/", getRanking);

    app.use("/api/ranking", router);
}

export default rankingRouter;