import prisma from "../db/prisma";
import { Prisma } from "../generated/prisma";
import { NotFoundError, ValidationError } from "../errors/applicationError";

type CreateCompanyParams = {
    name: string;
    email?: string | null;
    phone?: string | null;
};

type UpdateCompanyParams = {
    name?: string;
    email?: string | null;
    phone?: string | null;
};

const companyBaseSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
} as const;

type SafeCompany = Prisma.CompanyGetPayload<{ select: typeof companyBaseSelect }>;

const companyService = {
    async createCompany(data: CreateCompanyParams): Promise<SafeCompany> {
        return prisma.company.create({
            data: {
                name: data.name,
                email: data.email ?? null,
                phone: data.phone ?? null,
            },
            select: companyBaseSelect,
        });
    },

    async getCompanies(): Promise<SafeCompany[]> {
        return prisma.company.findMany({ select: companyBaseSelect });
    },

    async getCompanyById(id: string): Promise<SafeCompany> {
        const company = await prisma.company.findUnique({ where: { id }, select: companyBaseSelect });

        if (!company) {
            throw new NotFoundError("Company not found");
        }

        return company;
    },

    async updateCompany(id: string, data: UpdateCompanyParams): Promise<SafeCompany> {
        if (!hasAtLeastOneField(data)) {
            throw new ValidationError("No valid field to update");
        }

        const updateData = buildUpdatePayload(data);

        try {
            return await prisma.company.update({
                where: { id },
                data: updateData,
                select: companyBaseSelect,
            });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },

    async deleteCompany(id: string): Promise<void> {
        try {
            await prisma.company.delete({ where: { id } });
        } catch (error) {
            mapAndThrowPrismaError(error);
        }
    },
};

function buildUpdatePayload(data: UpdateCompanyParams): Prisma.CompanyUpdateInput {
    const updateData: Prisma.CompanyUpdateInput = {};

    if (typeof data.name === "string") {
        updateData.name = data.name;
    }

    if (typeof data.email !== "undefined") {
        updateData.email = data.email ?? null;
    }

    if (typeof data.phone !== "undefined") {
        updateData.phone = data.phone ?? null;
    }

    return updateData;
}

function hasAtLeastOneField(data: UpdateCompanyParams): boolean {
    return Object.values(data).some((value) => value !== undefined);
}

function mapAndThrowPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundError("Company not found");
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error("Unexpected error when acessing database");
}

export type { CreateCompanyParams, SafeCompany, UpdateCompanyParams };
export default companyService;
