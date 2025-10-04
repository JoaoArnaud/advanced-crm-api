import prisma from "../db/prisma";
import { Prisma } from "../generated/prisma";
import { NotFoundError, ValidationError } from "../errors/applicationError";

type CreateClientParams = {
    name: string;
    email?: string | null;
    phone?: string | null;
    cnpj?: string | null;
    leadOriginId?: number;
};

type UpdateClientParams = {
    name?: string;
    email?: string | null;
    phone?: string | null;
    cnpj?: string | null;
    leadOriginId?: number | null;
};

const clientBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    cnpj: true,
    companyId: true,
    leadOriginId: true,
    leadOrigin: {
        select: {
            id: true,
            name: true,
            status: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const;

type SafeClient = Prisma.ClientsGetPayload<{ select: typeof clientBaseSelect }>;

const clientService = {
    async createClient(companyId: string, data: CreateClientParams): Promise<SafeClient> {
        if (typeof data.leadOriginId === "number") {
            await validateLeadBelongsToCompany(companyId, data.leadOriginId);
        }

        const leadOriginConnection =
            typeof data.leadOriginId === "number"
                ? { leadOrigin: { connect: { id: data.leadOriginId } } }
                : {};

        return prisma.clients.create({
            data: {
                name: data.name,
                email: data.email ?? null,
                phone: data.phone ?? null,
                cnpj: data.cnpj ?? null,
                company: { connect: { id: companyId } },
                ...leadOriginConnection,
            },
            select: clientBaseSelect,
        });
    },

    async getClientsByCompany(companyId: string): Promise<SafeClient[]> {
        return prisma.clients.findMany({
            where: { companyId },
            select: clientBaseSelect,
        });
    },

    async getClientById(companyId: string, id: number): Promise<SafeClient> {
        const client = await prisma.clients.findFirst({
            where: { id, companyId },
            select: clientBaseSelect,
        });

        if (!client) {
            throw new NotFoundError("Client not found");
        }

        return client;
    },

    async updateClient(companyId: string, id: number, data: UpdateClientParams): Promise<SafeClient> {
        if (!hasAtLeastOneField(data)) {
            throw new ValidationError("No valid field to update");
        }

        await this.getClientById(companyId, id);

        const updateData: Prisma.ClientsUpdateInput = {};

        if (typeof data.name === "string") {
            updateData.name = data.name;
        }

        if (typeof data.email !== "undefined") {
            updateData.email = data.email ?? null;
        }

        if (typeof data.phone !== "undefined") {
            updateData.phone = data.phone ?? null;
        }

        if (typeof data.cnpj !== "undefined") {
            updateData.cnpj = data.cnpj ?? null;
        }

        if (typeof data.leadOriginId !== "undefined") {
            if (data.leadOriginId === null) {
                updateData.leadOrigin = { disconnect: true };
            } else {
                await validateLeadBelongsToCompany(companyId, data.leadOriginId);
                updateData.leadOrigin = { connect: { id: data.leadOriginId } };
            }
        }

        try {
            return await prisma.clients.update({
                where: { id },
                data: updateData,
                select: clientBaseSelect,
            });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },

    async deleteClient(companyId: string, id: number): Promise<void> {
        await this.getClientById(companyId, id);

        try {
            await prisma.clients.delete({ where: { id } });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },
};

function hasAtLeastOneField(data: UpdateClientParams): boolean {
    return Object.values(data).some((value) => value !== undefined);
}

async function validateLeadBelongsToCompany(companyId: string, leadId: number): Promise<void> {
    const lead = await prisma.leads.findFirst({ where: { id: leadId, companyId }, select: { id: true } });

    if (!lead) {
        throw new ValidationError("Lead origin not found for this company");
    }
}

function mapAndThrowPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("Client not found");
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error("Unexpected error when accessing database");
}

export type { CreateClientParams, UpdateClientParams, SafeClient };
export default clientService;
