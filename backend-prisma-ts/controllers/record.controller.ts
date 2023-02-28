import prisma from "../config/prisma";
import express, { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { RecordData } from "../types/record.type";
import { handleReqBody } from "../utils/validation";
import { PlayerData } from "../types/player.type";

// export type RecordData = {
//     rid: string;
//     pid: string;
//     score: number;
//     powerups: number;
//     time: number;
// };

const validate = {
    rdNotEmpty: (rd: RecordData) => {
        return (
            rd.playerId !== undefined &&
            rd.score    !== undefined &&
            rd.powerups !== undefined &&
            rd.time     !== undefined
        );
    },

    emptyField: <T>(field: T) => {
        return field ? true : false;
    },
};

const recordController = {
    create: async (req: Request, res: Response) => {
        const result = handleReqBody<RecordData>(
            req.body,
            { code: 400, msg: "Must playerId, score, powerups and time!" },
            validate.rdNotEmpty
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        // Player doesn't exist:
        if (
            !(await prisma.player.findUnique({
                where: { pid: result.value.playerId },
            }))
        )
            return res.json({ code: 404, msg: "Player not found" });

        // Everything's fine, collect data
        const record = {
            playerId: result.value.playerId,
            score: result.value.score,
            powerups: result.value.powerups,
            time: result.value.time,
        };

        prisma.record
            .create({ data: record })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                return res.json({
                    code: 500,
                    msg: "Some error occurred while saving the Record Data",
                });
            });
    },

    findAll: async (req: Request, res: Response) => {
        prisma.record
            .findMany()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send(
                    err.message ??
                        "Some error occurred while getting all Record Data"
                );
            });
    },

    findAllAndCount: async (req: Request, res: Response) => {
        const result = handleReqBody<{ playerId: string }>(
            req.params,
            { code: 400, msg: "Record ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg })

        // Player doesn't exist:
        if (
            !(await prisma.player.findUnique({
                where: { pid: result.value.playerId },
            }))
        )
            return res.json({ code: 404, msg: "Player not found" });

        const { playerId } = result.value;

        prisma.record
            .findMany({ where: { playerId } })
            .then((data) => {
                res.send(data);
            })  
            .catch((err) => {
                return res.json({
                    code: 500,
                    msg: "Some error ocurred while retrieving all Records by that Player"
                })
            });     
    },

    findByPk: async (req: Request, res: Response) => {
        const result = handleReqBody<{ rid: string }>(
            req.params,
            { code: 400, msg: "Record ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        const { rid } = result.value;

        // Send data
        // With promise
        prisma.record
            .findUnique({ where: { rid } })
            .then((data) => res.send(data))
            .catch((err) =>
                res
                    .status(500)
                    .send(
                        err.message ??
                            "Some error occurred while retrieving Record by rid"
                    )
            );
    },

    findOne: async (req: Request, res: Response) => {
        const result = handleReqBody<{ rid: string }>(
            req.params,
            { code: 400, msg: "Record ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        const { rid } = result.value;

        // Send data
        // With promise
        prisma.record
            .findUnique({ where: { rid } })
            .then((data) => res.send(data))
            .catch((err) =>
                res
                    .status(500)
                    .send(
                        err.message ??
                            "Some error occurred while retrieving Record by rid"
                    )
            );
    },

    update: async (req: Request<{ rid: string }>, res: Response) => {
        const result = handleReqBody<RecordData>(
            req.params,
            { code: 400, msg: "Content cannot be empty!" },
            validate.rdNotEmpty
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });
 
        const record = {
            playerId: result.value.playerId,
            score: result.value.score,
            powerups: result.value.powerups,
            time: result.value.time,
        };
 
        try {
            res.send(
                await prisma.record.update({
                    where: { rid: req.params.rid },
                    data: record,
                })
            );
        } catch (err: any) {
            res.status(500).send(
                "Some error occurred while retrieving Record by PID"
            );
        }
    },

    delete: async (req: Request<{ rid: string }>, res: Response) => {
        console.log(req.params)
        const result = handleReqBody<{ rid: string }>(
            req.params,
            { code: 400, msg: "Record ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });
    
        const { rid } = result.value;
    
        try {
            res.send(
                await prisma.record.delete({
                    where: { rid },
                })
            );
        } catch (err: any) {
            res.status(500).send(
                "Some error occurred while deleting Record by PID"
            );
        }
    },
};

export default recordController;