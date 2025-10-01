import argon2 from "argon2";
import prisma from "../db/prisma";
import { User, Role } from "../generated/prisma";

type createUserParams = {
    name: string; 
    email: string; 
    password: string; 
    companyId: string; 
}

type UpdateUserParams = {
    name?: string;
    companyId?: string;
    role?: Role;
};

const userService = {
    // create
    async createUser(data: createUserParams): Promise<User> {
    const passwordHash = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: Role.USER,
            company: {
                connect: { id: data.companyId },
            },
          },
        });
    },

    // read
    async getUsers(): Promise<User[]> {
        return prisma.user.findMany();
    },

    async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    },

    // update
    async updateUser(id: string, data: UpdateUserParams) {
        return prisma.user.update({
            where: { id },
            data,
        });
    },

    //delete
    async deleteUser(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
    }
};

export default userService;
