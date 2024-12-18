import {authRepository} from "../repositories/auth-repository";
import bcrypt from "bcrypt";
import {UserType} from "../db/types";

export const authService = {
    async register(username: string, password: string): Promise<UserType> {
        const hashedPassword = bcrypt.hashSync(password, 7)
        const userId = +new Date()
        return await authRepository.registerUser(userId, username, hashedPassword)
    },
    async login(username: string, password: string): Promise<{ token: string, userId: number } | string>  {
        return await authRepository.login(username, password)
    }
}