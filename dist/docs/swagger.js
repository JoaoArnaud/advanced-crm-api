"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Advanced CRM API",
            description: "Documentação da API de CRM avançado. Todos os recursos são multi-tenant: os dados ficam isolados por empresa.",
            version: "1.0.0",
            contact: {
                name: "Equipe Advanced CRM",
                email: "suporte@advancedcrm.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Ambiente local",
            },
        ],
        tags: [
            { name: "Usuários", description: "Gestão de usuários do CRM" },
            { name: "Empresas", description: "Cadastro e manutenção de empresas" },
            { name: "Leads", description: "Prospects vinculados a uma empresa" },
            { name: "Clientes", description: "Clientes ativos vinculados a uma empresa" },
        ],
        components: {
            schemas: {
                ErroPadrao: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Descrição do erro ocorrido",
                        },
                    },
                },
                Usuario: {
                    type: "object",
                    required: ["id", "name", "email", "role", "companyId", "createdAt", "updatedAt"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "Identificador do usuário",
                        },
                        name: {
                            type: "string",
                            description: "Nome completo do usuário",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "E-mail do usuário",
                        },
                        role: {
                            type: "string",
                            enum: ["ADMIN", "USER"],
                            description: "Perfil de acesso",
                        },
                        companyId: {
                            type: "string",
                            format: "uuid",
                            description: "ID da empresa a que o usuário pertence",
                        },
                        company: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "Nome da empresa",
                                },
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de criação do registro",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Última atualização do registro",
                        },
                    },
                },
                CriarUsuarioInput: {
                    type: "object",
                    required: ["name", "email", "password", "companyId"],
                    properties: {
                        name: {
                            type: "string",
                            description: "Nome completo",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "E-mail único do usuário",
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            description: "Senha com no mínimo 8 caracteres",
                        },
                        companyId: {
                            type: "string",
                            format: "uuid",
                            description: "Empresa à qual o usuário será associado",
                        },
                    },
                },
                AtualizarUsuarioInput: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        companyId: {
                            type: "string",
                            format: "uuid",
                        },
                        role: {
                            type: "string",
                            enum: ["ADMIN", "USER"],
                        },
                    },
                    description: "Informe pelo menos um campo para atualização.",
                },
                AutenticarUsuarioInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                        },
                        password: {
                            type: "string",
                        },
                    },
                },
                Empresa: {
                    type: "object",
                    required: ["id", "name", "createdAt", "updatedAt"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "Identificador da empresa",
                        },
                        name: {
                            type: "string",
                            description: "Nome da empresa",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                            description: "E-mail de contato",
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                            description: "Telefone de contato",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CriarEmpresaInput: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: {
                            type: "string",
                            description: "Nome da empresa",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                            description: "E-mail de contato",
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                            description: "Telefone de contato",
                        },
                    },
                },
                AtualizarEmpresaInput: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                        },
                    },
                    description: "Informe pelo menos um campo para atualização.",
                },
                Lead: {
                    type: "object",
                    required: ["id", "name", "status", "companyId", "createdAt", "updatedAt"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identificador do lead",
                        },
                        name: {
                            type: "string",
                            description: "Nome do lead",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                        },
                        status: {
                            type: "string",
                            enum: ["HOT", "WARM", "COLD"],
                            description: "Status atual do lead",
                        },
                        cnpj: {
                            type: "string",
                            nullable: true,
                        },
                        cpf: {
                            type: "string",
                            nullable: true,
                        },
                        companyId: {
                            type: "string",
                            format: "uuid",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CriarLeadInput: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: { type: "string", nullable: true },
                        status: {
                            type: "string",
                            enum: ["HOT", "WARM", "COLD"],
                        },
                        cnpj: { type: "string", nullable: true },
                        cpf: { type: "string", nullable: true },
                    },
                },
                AtualizarLeadInput: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: { type: "string", nullable: true },
                        status: {
                            type: "string",
                            enum: ["HOT", "WARM", "COLD"],
                        },
                        cnpj: { type: "string", nullable: true },
                        cpf: { type: "string", nullable: true },
                    },
                    description: "Informe pelo menos um campo para atualização.",
                },
                Cliente: {
                    type: "object",
                    required: ["id", "name", "companyId", "createdAt", "updatedAt"],
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identificador do cliente",
                        },
                        name: {
                            type: "string",
                            description: "Nome do cliente",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: {
                            type: "string",
                            nullable: true,
                        },
                        cnpj: {
                            type: "string",
                            nullable: true,
                        },
                        companyId: {
                            type: "string",
                            format: "uuid",
                        },
                        leadOriginId: {
                            type: "integer",
                            nullable: true,
                            description: "Lead que originou o cliente",
                        },
                        leadOrigin: {
                            type: "object",
                            nullable: true,
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                status: {
                                    type: "string",
                                    enum: ["HOT", "WARM", "COLD"],
                                },
                            },
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                CriarClienteInput: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: { type: "string", nullable: true },
                        cnpj: { type: "string", nullable: true },
                        leadOriginId: {
                            type: "integer",
                            minimum: 1,
                            description: "Lead da mesma empresa que originou este cliente",
                        },
                    },
                },
                AtualizarClienteInput: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                        },
                        phone: { type: "string", nullable: true },
                        cnpj: { type: "string", nullable: true },
                        leadOriginId: {
                            oneOf: [
                                {
                                    type: "integer",
                                    minimum: 1,
                                },
                                {
                                    type: "null",
                                },
                            ],
                            description: "Informe um ID válido ou null para desvincular o lead de origem.",
                        },
                    },
                    description: "Informe pelo menos um campo para atualização.",
                },
            },
            parameters: {
                UserIdParam: {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid",
                    },
                    description: "ID do usuário",
                },
                CompanyIdParam: {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid",
                    },
                    description: "ID da empresa",
                },
                CompanyScopeParam: {
                    name: "companyId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid",
                    },
                    description: "Empresa à qual o recurso pertence",
                },
                LeadIdParam: {
                    name: "leadId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer",
                        minimum: 1,
                    },
                    description: "ID do lead",
                },
                ClientIdParam: {
                    name: "clientId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer",
                        minimum: 1,
                    },
                    description: "ID do cliente",
                },
            },
        },
        paths: {
            "/api/users": {
                post: {
                    tags: ["Usuários"],
                    summary: "Criar usuário",
                    description: "Cria um novo usuário vinculado a uma empresa existente.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CriarUsuarioInput" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Usuário criado com sucesso",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Usuario" },
                                },
                            },
                        },
                        "409": {
                            description: "E-mail já cadastrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "400": {
                            description: "Dados inválidos",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": {
                            description: "Erro interno",
                        },
                    },
                },
                get: {
                    tags: ["Usuários"],
                    summary: "Listar usuários",
                    description: "Retorna todos os usuários cadastrados.",
                    responses: {
                        "200": {
                            description: "Lista de usuários",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Usuario" },
                                    },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/users/{id}": {
                get: {
                    tags: ["Usuários"],
                    summary: "Detalhar usuário",
                    parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
                    responses: {
                        "200": {
                            description: "Usuário encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Usuario" },
                                },
                            },
                        },
                        "404": {
                            description: "Usuário não encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                put: {
                    tags: ["Usuários"],
                    summary: "Atualizar usuário",
                    parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarUsuarioInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Usuário atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Usuario" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Usuário não encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                patch: {
                    tags: ["Usuários"],
                    summary: "Atualizar usuário parcialmente",
                    parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarUsuarioInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Usuário atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Usuario" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Usuário não encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                delete: {
                    tags: ["Usuários"],
                    summary: "Remover usuário",
                    parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
                    responses: {
                        "204": { description: "Usuário removido" },
                        "404": {
                            description: "Usuário não encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/users/login": {
                post: {
                    tags: ["Usuários"],
                    summary: "Autenticar usuário",
                    description: "Valida credenciais e retorna os dados do usuário.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AutenticarUsuarioInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Credenciais válidas",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Usuario" },
                                },
                            },
                        },
                        "401": {
                            description: "Credenciais inválidas",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "400": {
                            description: "Dados inválidos",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies": {
                post: {
                    tags: ["Empresas"],
                    summary: "Criar empresa",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CriarEmpresaInput" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Empresa criada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Empresa" },
                                },
                            },
                        },
                        "400": {
                            description: "Dados inválidos",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                get: {
                    tags: ["Empresas"],
                    summary: "Listar empresas",
                    responses: {
                        "200": {
                            description: "Lista de empresas",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Empresa" },
                                    },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies/{id}": {
                get: {
                    tags: ["Empresas"],
                    summary: "Detalhar empresa",
                    parameters: [{ $ref: "#/components/parameters/CompanyIdParam" }],
                    responses: {
                        "200": {
                            description: "Empresa encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Empresa" },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                put: {
                    tags: ["Empresas"],
                    summary: "Atualizar empresa",
                    parameters: [{ $ref: "#/components/parameters/CompanyIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarEmpresaInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Empresa atualizada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Empresa" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                patch: {
                    tags: ["Empresas"],
                    summary: "Atualizar empresa parcialmente",
                    parameters: [{ $ref: "#/components/parameters/CompanyIdParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarEmpresaInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Empresa atualizada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Empresa" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                delete: {
                    tags: ["Empresas"],
                    summary: "Remover empresa",
                    parameters: [{ $ref: "#/components/parameters/CompanyIdParam" }],
                    responses: {
                        "204": { description: "Empresa removida" },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies/{companyId}/leads": {
                post: {
                    tags: ["Leads"],
                    summary: "Criar lead",
                    description: "Cria um lead visível apenas para a empresa informada.",
                    parameters: [{ $ref: "#/components/parameters/CompanyScopeParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CriarLeadInput" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Lead criado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Lead" },
                                },
                            },
                        },
                        "400": {
                            description: "Dados inválidos",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                get: {
                    tags: ["Leads"],
                    summary: "Listar leads da empresa",
                    parameters: [{ $ref: "#/components/parameters/CompanyScopeParam" }],
                    responses: {
                        "200": {
                            description: "Lista de leads",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Lead" },
                                    },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies/{companyId}/leads/{leadId}": {
                get: {
                    tags: ["Leads"],
                    summary: "Detalhar lead",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/LeadIdParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Lead encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Lead" },
                                },
                            },
                        },
                        "404": {
                            description: "Lead não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                put: {
                    tags: ["Leads"],
                    summary: "Atualizar lead",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/LeadIdParam" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarLeadInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Lead atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Lead" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Lead não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                patch: {
                    tags: ["Leads"],
                    summary: "Atualizar lead parcialmente",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/LeadIdParam" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarLeadInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Lead atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Lead" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Lead não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                delete: {
                    tags: ["Leads"],
                    summary: "Remover lead",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/LeadIdParam" },
                    ],
                    responses: {
                        "204": { description: "Lead removido" },
                        "404": {
                            description: "Lead não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies/{companyId}/clients": {
                post: {
                    tags: ["Clientes"],
                    summary: "Criar cliente",
                    description: "Cria um cliente vinculado à empresa. Opcionalmente associa a um lead da mesma empresa.",
                    parameters: [{ $ref: "#/components/parameters/CompanyScopeParam" }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CriarClienteInput" },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "Cliente criado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Cliente" },
                                },
                            },
                        },
                        "400": {
                            description: "Dados inválidos ou lead de outra empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                get: {
                    tags: ["Clientes"],
                    summary: "Listar clientes da empresa",
                    parameters: [{ $ref: "#/components/parameters/CompanyScopeParam" }],
                    responses: {
                        "200": {
                            description: "Lista de clientes",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Cliente" },
                                    },
                                },
                            },
                        },
                        "404": {
                            description: "Empresa não encontrada",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
            "/api/companies/{companyId}/clients/{clientId}": {
                get: {
                    tags: ["Clientes"],
                    summary: "Detalhar cliente",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/ClientIdParam" },
                    ],
                    responses: {
                        "200": {
                            description: "Cliente encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Cliente" },
                                },
                            },
                        },
                        "404": {
                            description: "Cliente não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                put: {
                    tags: ["Clientes"],
                    summary: "Atualizar cliente",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/ClientIdParam" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarClienteInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Cliente atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Cliente" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado ou lead inválido",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Cliente não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                patch: {
                    tags: ["Clientes"],
                    summary: "Atualizar cliente parcialmente",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/ClientIdParam" },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/AtualizarClienteInput" },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Cliente atualizado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Cliente" },
                                },
                            },
                        },
                        "400": {
                            description: "Nenhum campo informado ou lead inválido",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "404": {
                            description: "Cliente não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
                delete: {
                    tags: ["Clientes"],
                    summary: "Remover cliente",
                    parameters: [
                        { $ref: "#/components/parameters/CompanyScopeParam" },
                        { $ref: "#/components/parameters/ClientIdParam" },
                    ],
                    responses: {
                        "204": { description: "Cliente removido" },
                        "404": {
                            description: "Cliente não encontrado para esta empresa",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/ErroPadrao" },
                                },
                            },
                        },
                        "500": { description: "Erro interno" },
                    },
                },
            },
        },
    },
    apis: [],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerSpec;
