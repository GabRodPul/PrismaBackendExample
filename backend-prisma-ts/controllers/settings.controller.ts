import prisma from "../config/prisma";
import express, { Request, Response } from "express";
import { Prisma } from "@prisma/client";
// import { RecordData } from "../types/record.type";
import { SettingsData } from "../types/settings.type";
import { handleReqBody } from "../utils/validation";

const validate = {
    stNotEmpty: (st: SettingsData) => {
        return (
            // st.sid !== undefined &&
            st.playerId !== undefined &&
            st.volumePercentage !== undefined
        );
    },

    emptyField: <T>(field: T) => {
        return field ? true : false;
    },
}

const clamp = (n: number, min: number, max: number) => {
    if (n <= min) return min;
    if (n >= max) return max;
    return n;
}

const roundToFloat = (n: number, places: number) => {
    return parseFloat(n.toFixed(places));
}

const settingsController = {
    create: async (req: Request, res: Response) => {
        const result = handleReqBody<SettingsData>(
            req.body,
            { code: 400, msg: "Must provide SID, PID and volume percentage (0.0 to 1.0)." },
            validate.stNotEmpty
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

        
        // Everything's fine, collect data
        const settings = {
            sid: result.value.sid,
            playerId: result.value.playerId,
            volumePercentage: clamp(
                result.value.volumePercentage,
                0,
                100
            )
        };

        prisma.settings
            .create({ data: settings })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                return res.json({
                    code: 500,
                    msg: "Some error ocurre while saving the Settings"
                })
            });
    },

    findAll: async (req: Request, res: Response) => {
        prisma.settings
            .findMany()
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                return res.json({
                    code: 500,
                    msg: "Some error ocurre while saving the Settings"
                })
            })
    },

    findByPk: async (req: Request, res: Response) => {
        const result = handleReqBody<{ sid: string }>(
            req.params,
            { code: 400, msg: "Settings ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        const { sid } = result.value;

        // Send data
        // With promise
        prisma.settings
            .findUnique({ where: { sid } })
            .then((data) => res.send(data))
            .catch((err) =>
                res
                    .status(500)
                    .send(
                        err.message ??
                            "Some error occurred while retrieving Settings by SID"
                    )
            );
    },

    findOne: async (req: Request, res: Response) => {
        const result = handleReqBody<{ pid: string }>(
            req.params,
            { code: 400, msg: "Settings ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        // Check if the player doesn't exist:
        if (
            !(await prisma.player.findUnique({
                where: { pid: result.value.pid },
            }))
        )
            return res.json({ code: 404, msg: "Player not found" });


        prisma.settings
            .findUnique({ where: { playerId: result.value.pid } })
            .then((data) => res.send(data))
            .catch((err) => {
                return res.json({ code: 500, msg: "Some error occurred while retrieving Settings" });
            });
    },
    
    update: async (req: Request<{ pid: string }>, res: Response) => {
        const result = handleReqBody<SettingsData>(
            req.body,
            { code: 400, msg: "Must provide !" },
            validate.stNotEmpty
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });
    
        const settings = {
            sid: result.value.sid,
            playerId: result.value.playerId,
            volumePercentage: clamp(
                result.value.volumePercentage,
                0,
                100
            )
        };

        console.log(settings);

        prisma.settings.update({
            where: { playerId: settings.playerId },
            data: settings
        })
        .then((data) => res.send(data))
        .catch((err) => {
            return res.json({ code: 500, msg: "Some error ocurred while updating the Settings" })
        });
    },

    delete: async (req: Request<{ sid: string }>, res: Response) => {
        const result = handleReqBody<{ sid: string }>(
            req.params,
            { code: 400, msg: "Settings ID cannot be empty!" },
            validate.emptyField
        );

        if (!result.ok)
            return res.json({ code: result.error.code, msg: result.error.msg });

        prisma.settings.delete({
            where: { sid: result.value.sid }
        })
        .then((data) => res.send(data))
        .catch((err) => {
            return res.json({ code: 500, msg: "S" })
        })
    },
}

export default settingsController; 