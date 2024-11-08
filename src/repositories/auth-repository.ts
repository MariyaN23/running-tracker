import {usersCollection} from "../db/db";
import bcrypt from "bcrypt";
import {generateAccessToken} from "./token";
import {UserType} from "../db/types";

export const authRepository = {
    async registerUser(id: number, username: string, password: string): Promise<UserType> {
        const foundUser = await usersCollection.findOne({username})
        if (foundUser) {
            throw new Error(`User with username ${username} already exist`)
        } else {
            const newUser: UserType = {id, username, password}
            await usersCollection.insertOne(newUser)
            return newUser
        }
    },
    async login(username: string, password: string): Promise<{token: string, userId: number} | string> {
        const foundUser = await usersCollection.findOne({username})
        if (foundUser) {
            const validPassword = bcrypt.compareSync(password, foundUser.password)
            if (validPassword) {
                const token = generateAccessToken(foundUser._id)
                const userId = foundUser.id
                return {token, userId}
            }
        }
        return 'Incorrect username or password'
    }
}