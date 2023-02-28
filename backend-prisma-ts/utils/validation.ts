import prisma from "../config/prisma";
import express, { Request, Response } from "express";
import { encryptPassword } from "./encrypt";
import { Prisma } from "@prisma/client";


export type Result<T, E = Error> =
    | { ok: true ; value: T }
    | { ok: false; error: E };

export type ResParams = { code: number, msg: string };

function handleReqBody<T>(
    reqBody: any,
    resData: { code: number, msg: string },
    validate: (body: T) => boolean
): Result<T, ResParams> {
    if (!reqBody) {
        return {
            ok: false,
            error: { code: 400, msg: "Content cannot be empty!" }
        };
    }
    const body = reqBody as T;

    console.log(body)
    if (!validate(body)) {
        return {
            ok: false,
            error: { code: resData.code, msg: resData.msg }
        };
    }

    return { ok: true, value: body };
}

export { handleReqBody };