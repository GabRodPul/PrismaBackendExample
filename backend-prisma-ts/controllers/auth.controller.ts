import express, { Request, Response } from "express";
import prisma from "../config/prisma";

import { PlayerData } from "../types/player.type";
import { encryptPassword, generateToken, matchPassword } from "../utils/encrypt";
import { handleReqBody } from "../utils/validation";

import playerController from "./player.controller";
import bcrypt from "bcrypt";

function bodyNotEmpty(body: PlayerData): boolean {
    return body.username !== undefined && body.password !== undefined;
}

const authController = {
    login: async (req: Request, res: Response) => {
        const result = handleReqBody<PlayerData>(
            req.body,
            { code: 400, msg: "Must provide username and password!" },
            bodyNotEmpty
        );

        if (!result.ok) return res.json(result.error);

        const body: PlayerData = result.value;
        prisma.player
            .findUnique({ where: { username: body.username } })
            .then((data) => {
                if (!data || !matchPassword(body.password, data.password)) {
                    return res.json({ code: 401, msg: "User or password invalid!" });
                }
                console.log(data)
                const { pid, username, isAdmin } = data;
                return res.json({ 
                    // player: data,
                    username, isAdmin,
                    access_token: generateToken({ pid, username, isAdmin }),
                })
            })
            .catch((err) => {
                res.status(500).send("Some error occurred while retrieving Player by PID");
            });
    },

    signin: async (req: Request, res: Response) => {
        console.log(req)
        const result = handleReqBody<PlayerData>(
            req.body,
            { code: 400, msg: "Must provide username and password!" },
            bodyNotEmpty
        );

        if (!result.ok) return res.json(result.error);

        const body = {
            username: result.value.username,
            password: await encryptPassword(result.value.password),
        };

        // console.log(body)
        // With promise
        prisma.player
            .create({ data: body })
            .then((data) => {
                const { pid, username, isAdmin } = data;
                return res.json({
                    username, isAdmin,
                    access_token: generateToken(data),
                });
            })
            .catch((err) => {
                switch (err.code) {
                    case "P2002":
                        return res.json({
                            code: 400,
                            msg: `Player with username ${body.username} already exists`,
                        });

                    default:
                        return res.json({
                            code: 500,
                            msg: "Some error occurred while creating the Player",
                        });
                }
            });
    },
};

export default authController;
