import React, { useState, useCallback } from 'react';
import { APIInteraction, APIInteractionResponse } from '../APIInteraction';
import { login_BrokenAuth } from '../../services/api';

export const API2_BrokenAuthentication: React.FC = () => {
    const [body, setBody] = useState(JSON.stringify({ user: 'admin', pass: 'password' }, null, 2));

    const handleRequest = useCallback(async (): Promise<APIInteractionResponse> => {
        try {
            const parsedBody = JSON.parse(body);
            const result = await login_BrokenAuth(parsedBody.user, parsedBody.pass);
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: result
            };
        } catch (e: unknown) {
            const error = e as Error;
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: { error: error.message },
                isError: true,
            };
        }
    }, [body]);

    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                Observe que, independentemente das credenciais que você envia no corpo da requisição (desde que não estejam vazias), o servidor responde com um status <code>200 OK</code> e um token JWT.
            </p>
             <p className="text-sm mb-2">
                Isso indica que o backend não está validando as senhas. Além disso, não há mecanismos de limitação de taxa (rate limiting). Um invasor poderia tentar milhares de senhas por segundo (ataque de força bruta) sem ser bloqueado.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> A ausência de validação de credenciais e a falta de proteção contra força bruta são falhas críticas de autenticação. A API efetivamente permite o acesso a qualquer pessoa que conheça um nome de usuário.
            </p>
             <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Utilize frameworks de autenticação padrão e bem testados. Implemente políticas de senhas fortes, proteção contra ataques de força bruta (bloqueio de conta e limitação de taxa) e use tokens (como JWT) com tempo de expiração curto e assinaturas seguras.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API2:2023 – Broken Authentication
                </h1>
                <p className="text-lg text-gray-300">Permitir que invasores se passem por usuários legítimos.</p>
            </header>
            
            <p className="text-gray-300">
                Sua missão: Tente fazer login com qualquer nome de usuário e senha editando o corpo da requisição abaixo. Observe como a API concede acesso em todos os casos.
            </p>

            <APIInteraction
                method="POST"
                path="/login"
                body={body}
                onBodyChange={setBody}
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
            />
        </div>
    );
};