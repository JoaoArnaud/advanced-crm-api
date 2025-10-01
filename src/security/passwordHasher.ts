import argon2 from "argon2";

const hashConfig = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
} as const;

export async function hashPassword(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword, hashConfig);
}

export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, plainPassword);
    } catch {
        return false;
    }
}
