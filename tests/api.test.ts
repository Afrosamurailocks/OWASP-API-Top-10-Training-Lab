import { describe, it, expect } from '../utils/test-helpers';
import * as api from '../services/api';
import type { User } from '../types';

describe('API Service Tests', () => {

    // API1: BOLA
    describe('API1: BOLA - fetchUserData_BOLA', () => {
        it('should fetch data for an existing user', async () => {
            const user = await api.fetchUserData_BOLA('101');
            expect(user).toBeDefined();
            expect(user.id).toBe('101');
            expect(user.name).toBe('Alice Silva');
        });

        it('should throw an error for a non-existing user', async () => {
            await expect(() => api.fetchUserData_BOLA('999')).toThrow('Usuário não encontrado.');
        });
    });

    // API2: Broken Authentication
    describe('API2: Broken Authentication - login_BrokenAuth', () => {
        it('should return a token for any non-empty credentials', async () => {
            const result = await api.login_BrokenAuth('user', 'pass');
            expect(result).toHaveProperty('token');
            expect(result.token).toBeTruthy();
        });

        it('should throw an error for empty credentials', async () => {
            await expect(() => api.login_BrokenAuth('', '')).toThrow('Usuário e senha são obrigatórios.');
        });
    });

    // API3: BOPLA
    describe('API3: BOPLA - fetchUserData_BOPLA', () => {
        it('should fetch a full user object, including sensitive data', async () => {
            const user = await api.fetchUserData_BOPLA('202') as User;
            expect(user).toBeDefined();
            expect(user.id).toBe('202');
            expect(user).toHaveProperty('salary');
            expect(user).toHaveProperty('personalNotes');
            expect(user.salary).toBe(95000);
        });
        
        it('should throw an error for a non-existing user', async () => {
            await expect(() => api.fetchUserData_BOPLA('999')).toThrow('Usuário não encontrado.');
        });
    });
    
    // API4: Unrestricted Resource Consumption
    describe('API4: Resource Consumption - fetchLogs_ResourceConsumption', () => {
        it('should return a success message based on the limit', async () => {
            const limit = 50;
            const result = await api.fetchLogs_ResourceConsumption(limit);
            expect(result.message).toBe(`Sucesso! Buscou ${limit} registros de log.`);
            expect(result.responseTime).toBe(`${limit * 10}ms`);
        });
    });
    
    // API5: BFLA
    describe('API5: BFLA - promoteUser_BFLA', () => {
        it('should return a success message for promoting an existing user', async () => {
            const result = await api.promoteUser_BFLA('404');
            expect(result.message).toBe('Usuário Daniel Oliveira foi promovido para Admin (simulado).');
        });
        
        it('should throw an error for a non-existing user', async () => {
            await expect(() => api.promoteUser_BFLA('999')).toThrow('Usuário não encontrado.');
        });
    });

    // API7: SSRF
    describe('API7: SSRF - fetchImageFromUrl_SSRF', () => {
        it('should return an error for a localhost URL', async () => {
            const result = await api.fetchImageFromUrl_SSRF('http://localhost/admin');
            expect(result).toBe('ERRO: Conexão recusada para localhost (Simulando acesso a recurso interno).');
        });
        
        it('should return a success message for an external URL', async () => {
            const result = await api.fetchImageFromUrl_SSRF('http://example.com/image.png');
            expect(result).toBe('Sucesso: Imagem de http://example.com/image.png foi buscada (simulado).');
        });
        
        it('should throw an error for an invalid URL', async () => {
            await expect(() => api.fetchImageFromUrl_SSRF('not-a-url')).toThrow('URL inválida.');
        });
    });
    
    // API8: Security Misconfiguration
    describe('API8: Security Misconfig - triggerError_Misconfig', () => {
        it('should throw a detailed error message', async () => {
            await expect(() => api.triggerError_Misconfig()).toThrow(/DATABASE_ERROR/);
        });
    });

    // API9: Improper Inventory Management
    describe('API9: Inventory Management - v1 vs v2', () => {
        it('v1 should fetch a full user object, including sensitive data', async () => {
            const user = await api.fetchUserData_v1('303');
            expect(user).toBeDefined();
            expect(user).toHaveProperty('salary');
            expect(user).toHaveProperty('personalNotes');
        });
        
        it('v2 should fetch a partial user object, excluding sensitive data', async () => {
            const user = await api.fetchUserData_v2('303');
            expect(user).toBeDefined();
            expect(user.hasOwnProperty('salary')).toBe(false);
            expect(user.hasOwnProperty('personalNotes')).toBe(false);
        });

        it('v1 should throw an error for a non-existing user', async () => {
            await expect(() => api.fetchUserData_v1('999')).toThrow('Usuário não encontrado.');
        });

        it('v2 should throw an error for a non-existing user', async () => {
            await expect(() => api.fetchUserData_v2('999')).toThrow('Usuário não encontrado.');
        });
    });
});
