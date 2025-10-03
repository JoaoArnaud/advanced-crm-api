import prisma from "../db/prisma";
import { Prisma, Role } from "../generated/prisma";
import { hashPassword, verifyPassword } from "../security/passwordHasher";
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../errors/applicationError";

type CreateUserParams = {
    name: string;
    email: string;
    password: string;
    companyId: string;
};

type UpdateUserParams = {
    name?: string;
    companyId?: string;
    role?: Role;
};

const userBaseSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    companyId: true,
    company: {
        select: {
            name: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const;

type SafeUser = Prisma.UserGetPayload<{ select: typeof userBaseSelect }>;

const userService = {
    async createUser(data: CreateUserParams): Promise<SafeUser> {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });

        if (existing) {
            throw new ConflictError("E-mail alredy registered");
        }

        const passwordHash = await hashPassword(data.password);

        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: Role.USER,
                company: { connect: { id: data.companyId } },
            },
            select: userBaseSelect,
        });
    },

    async getUsers(): Promise<SafeUser[]> {
        return prisma.user.findMany({ select: userBaseSelect });
    },

    async getUserById(id: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({ where: { id }, select: userBaseSelect });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    },

    async updateUser(id: string, data: UpdateUserParams): Promise<SafeUser> {
        const updateData = buildUpdatePayload(data);

        if (!hasAtLeastOneField(updateData)) {
            throw new ValidationError("No valid field to update");
        }

        try {
            return await prisma.user.update({
                where: { id },
                data: updateData,
                select: userBaseSelect,
            });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },

    async deleteUser(id: string): Promise<void> {
        try {
            await prisma.user.delete({ where: { id } });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },

    async verifyCredentials(email: string, password: string): Promise<SafeUser> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                ...userBaseSelect,
                passwordHash: true,
            },
        });

        if (!user) {
            throw new AuthenticationError();
        }

        const isValid = await verifyPassword(user.passwordHash, password);

        if (!isValid) {
            throw new AuthenticationError();
        }

        const { passwordHash, ...safeUser } = user;
        return safeUser;
    },
};

function buildUpdatePayload(data: UpdateUserParams): Prisma.UserUpdateInput {
    const updateData: Prisma.UserUpdateInput = {};

    if (typeof data.name === "string") {
        updateData.name = data.name;
    }

    if (typeof data.companyId === "string") {
        updateData.company = { connect: { id: data.companyId } };
    }

    if (typeof data.role !== "undefined") {
        updateData.role = data.role;
    }

    return updateData;
}

function hasAtLeastOneField(data: Prisma.UserUpdateInput): boolean {
    return Boolean(data.name || data.company || data.role);
}

function mapAndThrowPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("User not found");
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error("Unexpected error when acessing database");
}

export type { CreateUserParams, SafeUser, UpdateUserParams };
export default userService;
