import { Request, Response } from "express";
import prisma from "../config/prisma";

import { PlayerData } from "../types/player.type"
import { RecordData } from "../types/record.type"
import { Ranking as RankingData } from "../types/ranking.type"

const getRanking = async (req: Request, res: Response) => {
    const players: PlayerData[] = await prisma.player.findMany();
    const records: RecordData[] = await prisma.record.findMany();

    const usernameMap = new Map();
    players.forEach((player) => usernameMap.set(player.pid, player.username));

    console.log(usernameMap);

    let ranking: RankingData[] = [];
    records.forEach((record, index) => {
        const username = usernameMap.get(record.playerId);
        const data: RankingData = {
            number: index + 1,
            username,
            ...record
        }
        ranking.push(data);
    });

    ranking.sort((r1, r2) => {
        return r1.score - r2.score;
    });

    ranking.reverse()

    ranking.forEach((_, index) => {
        ranking[index].position = index + 1
    });

    return res.json(ranking);
}

export { getRanking };

