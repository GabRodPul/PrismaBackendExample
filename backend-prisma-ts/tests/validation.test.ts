import { describe, expect, test } from "@jest/globals";
import { handleReqBody } from "../utils/validation";

import { PlayerData } from "../types/player.type"
import { faker } from "@faker-js/faker"

const emptyContent = { code: 400, msg: "Content cannot be empty!" };

const validatePlayerData = (data: PlayerData) => {
    // isAdmin doesn't have to be validated because the controller sets
    // it as false if it isn't present.
    return data.username !== undefined && 
           data.password !== undefined
}

const resData = { // Response data in case the validation fails
    code: 401,
    msg: "Must provide username and password"
}


describe("Validation Module", () => {
    test(`Call with an empty body, should return not \"Ok\" with value ${emptyContent}`, () => {
        const req = { };        
        
        const result = handleReqBody<PlayerData>(req, resData, validatePlayerData);
        
        expect(result.ok).toBe(false);
    })
    
    test("Checks if the user is valid to return an \"Ok\" result", () => {
        const req = {
            username: faker.internet.userName(),
            password: faker.internet.password()
        };
        
        const result = handleReqBody<PlayerData>(req, resData, validatePlayerData);

        expect(result.ok).toBe(true);
    })
});









