import type { User } from '../types';

const mockUserDatabase: User[] = [
  {
    id: '101',
    name: 'Alice Silva',
    email: 'alice.silva@example.com',
    role: 'User',
    lastLogin: '2024-07-30T10:00:00Z',
    department: 'Marketing',
    salary: 60000,
    personalNotes: "Avaliação de desempenho próxima semana."
  },
  {
    id: '202',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    role: 'Manager',
    lastLogin: '2024-07-30T09:30:00Z',
    department: 'Engenharia',
    salary: 95000,
    personalNotes: "Contratar 2 novos desenvolvedores até o final do trimestre."
  },
  {
    id: '303',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    role: 'Admin',
    lastLogin: '2024-07-29T15:45:00Z',
    department: 'TI',
    salary: 120000,
    personalNotes: "Planejar a migração do servidor para o próximo mês."
  },
  {
    id: '404',
    name: 'Daniel Oliveira',
    email: 'daniel.oliveira@example.com',
    role: 'User',
    lastLogin: '2024-07-30T11:20:00Z',
    department: 'Vendas'
  },
];

// Funções para gerenciamento de estado global
export const getMockUsers = (): User[] => mockUserDatabase;
export const getUserById = (id: string): User | undefined => mockUserDatabase.find(u => u.id === id);


const networkDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// --- API1: BOLA ---
export const fetchUserData_BOLA = async (userId: string): Promise<User> => {
  await networkDelay();
  const user = mockUserDatabase.find(u => u.id === userId);
  if (user) return user;
  throw new Error('Usuário não encontrado.');
};

// --- API2: Broken Authentication ---
export const login_BrokenAuth = async (user: string, pass: string) => {
  await networkDelay(1000);
  if (!user || !pass) throw new Error("Usuário e senha são obrigatórios.");
  // VULNERABILIDADE: Aceita qualquer login, simulando autenticação fraca.
  return { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDEiLCJyb2xlIjoiVXNlciIsImV4cCI6MTcxOTc4MjQwMH0.DUMMY_SIGNATURE_FOR_DEMO_PURPOSES" };
};

// --- API3: BOPLA ---
// Este endpoint é vulnerável, retorna todos os dados
export const fetchUserData_BOPLA = async (userId: string): Promise<Partial<User>> => {
  await networkDelay();
  const user = mockUserDatabase.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado.');
  // VULNERABILIDADE: O endpoint sempre retorna todos os dados, incluindo os sensíveis.
  return user;
};


// --- API4: Unrestricted Resource Consumption ---
export const fetchLogs_ResourceConsumption = async (limit: number) => {
  // VULNERABILIDADE: A API não impõe um limite máximo. Um `limit` muito grande pode sobrecarregar o servidor.
  const delay = Math.min(limit * 10, 5000); // Simula o esforço do servidor
  await networkDelay(delay);
  return {
    message: `Sucesso! Buscou ${limit} registros de log.`,
    responseTime: `${delay}ms`
  }
};

// --- API5: BFLA ---
export const promoteUser_BFLA = async (userId: string) => {
  await networkDelay();
  // VULNERABILIDADE: Esta função não verifica se o solicitante é um admin.
  // Qualquer usuário autenticado pode chamar este endpoint.
  const user = mockUserDatabase.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado.');
  return { message: `Usuário ${user.name} foi promovido para Admin (simulado).` };
};


// --- API7: SSRF ---
export const fetchImageFromUrl_SSRF = async (url: string) => {
  await networkDelay();
  try {
    const parsedUrl = new URL(url);
    // VULNERABILIDADE: Nenhuma validação de lista de permissões ou negações é feita no backend.
    if (['127.0.0.1', 'localhost', '169.254.169.254'].includes(parsedUrl.hostname)) {
      return `ERRO: Conexão recusada para ${parsedUrl.hostname} (Simulando acesso a recurso interno).`;
    }
    return `Sucesso: Imagem de ${url} foi buscada (simulado).`;
  } catch (e) {
    throw new Error("URL inválida.");
  }
};

// --- API8: Security Misconfiguration ---
export const triggerError_Misconfig = async () => {
  await networkDelay(500);
  // VULNERABILIDADE: O backend retorna uma mensagem de erro detalhada com informações do sistema.
  throw new Error(`
    DATABASE_ERROR: Falha ao conectar no banco de dados.
    at connect (internal/db/connector.js:89:16)
    at processTicksAndRejections (internal/process/task_queues.js:96:5)
    DETAILS: { user: 'db_user', host: 'prod-db-v1.internal.corp', db: 'user_profiles' }
    Node.js Version: v18.12.1
    Framework: Express 4.17.1
  `);
};

// --- API9: Improper Inventory Management ---
// v1 - Versão antiga e insegura, expõe todos os dados.
export const fetchUserData_v1 = async (userId: string): Promise<User> => {
  await networkDelay();
  const user = mockUserDatabase.find(u => u.id === userId);
  if (user) return user; // Retorna tudo, incluindo salário e notas
  throw new Error('Usuário não encontrado.');
};

// v2 - Versão nova e segura, esconde dados sensíveis.
export const fetchUserData_v2 = async (userId: string): Promise<Partial<User>> => {
  await networkDelay();
  const user = mockUserDatabase.find(u => u.id === userId);
  if (!user) throw new Error('Usuário não encontrado.');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { salary, personalNotes, ...safeData } = user;
  return safeData;
};