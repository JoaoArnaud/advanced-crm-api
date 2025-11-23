import prisma from "../db/prisma";
import { LeadStatus, Prisma } from "@prisma/client";
import { NotFoundError, ValidationError } from "../errors/applicationError";

type CreateLeadParams = {
    name: string;
    email?: string | null;
    phone?: string | null;
    status?: LeadStatus;
    cnpj?: string | null;
    cpf?: string | null;
};

type UpdateLeadParams = {
    name?: string;
    email?: string | null;
    phone?: string | null;
    status?: LeadStatus;
    cnpj?: string | null;
    cpf?: string | null;
};

const leadBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    cnpj: true,
    cpf: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
} as const;

type SafeLead = Prisma.LeadsGetPayload<{ select: typeof leadBaseSelect }>;

const leadService = {
    async createLead(companyId: string, data: CreateLeadParams): Promise<SafeLead> {
        return prisma.leads.create({
            data: {
                name: data.name,
                email: data.email ?? null,
                phone: data.phone ?? null,
                status: data.status ?? LeadStatus.WARM,
                cnpj: data.cnpj ?? null,
                cpf: data.cpf ?? null,
                company: { connect: { id: companyId } },
            },
            select: leadBaseSelect,
        });
    },

    async getLeadsByCompany(companyId: string): Promise<SafeLead[]> {
        return prisma.leads.findMany({
            where: { companyId },
            select: leadBaseSelect,
        });
    },

    async getLeadById(companyId: string, id: number): Promise<SafeLead> {
        const lead = await prisma.leads.findFirst({
            where: { id, companyId },
            select: leadBaseSelect,
        });

        if (!lead) {
            throw new NotFoundError("Lead not found");
        }

        return lead;
    },

    async updateLead(companyId: string, id: number, data: UpdateLeadParams): Promise<SafeLead> {
        if (!hasAtLeastOneField(data)) {
            throw new ValidationError("No valid field to update");
        }

        await this.getLeadById(companyId, id);
        const updateData = buildUpdatePayload(data);

        try {
            return await prisma.leads.update({
                where: { id },
                data: updateData,
                select: leadBaseSelect,
            });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },

    async deleteLead(companyId: string, id: number): Promise<void> {
        await this.getLeadById(companyId, id);

        try {
            await prisma.leads.delete({ where: { id } });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },
};

function buildUpdatePayload(data: UpdateLeadParams): Prisma.LeadsUpdateInput {
    const updateData: Prisma.LeadsUpdateInput = {};

    if (typeof data.name === "string") {
        updateData.name = data.name;
    }

    if (typeof data.email !== "undefined") {
        updateData.email = data.email ?? null;
    }

    if (typeof data.phone !== "undefined") {
        updateData.phone = data.phone ?? null;
    }

    if (typeof data.status !== "undefined") {
        updateData.status = data.status;
    }

    if (typeof data.cnpj !== "undefined") {
        updateData.cnpj = data.cnpj ?? null;
    }

    if (typeof data.cpf !== "undefined") {
        updateData.cpf = data.cpf ?? null;
    }

    return updateData;
}

function hasAtLeastOneField(data: UpdateLeadParams): boolean {
    return Object.values(data).some((value) => value !== undefined);
}

function mapAndThrowPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("Lead not found");
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error("Unexpected error when accessing database");
}

export type { CreateLeadParams, UpdateLeadParams, SafeLead };
export default leadService;
