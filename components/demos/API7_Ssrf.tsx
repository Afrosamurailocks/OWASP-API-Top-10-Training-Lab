import React, { useState, useCallback } from 'react';
import { APIInteraction, APIInteractionResponse } from '../APIInteraction';
import { fetchImageFromUrl_SSRF } from '../../services/api';

export const API7_Ssrf: React.FC = () => {
    const [body, setBody] = useState(JSON.stringify({ url: 'http://localhost/admin' }, null, 2));

    const handleRequest = useCallback(async (): Promise<APIInteractionResponse> => {
        try {
            const parsedBody = JSON.parse(body);
            const result = await fetchImageFromUrl_SSRF(parsedBody.url);
             const isError = result.startsWith('ERRO');
            return {
                status: isError ? 400 : 200,
                body: { result },
                isError,
            };
        } catch (e: unknown) {
            return { status: 400, body: { error: (e as Error).message }, isError: true };
        }
    }, [body]);
    
    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                Quando você envia uma URL apontando para um recurso interno (ex: <code>http://localhost/admin</code>), a resposta da API é um erro simulado: <code>"Conexão recusada"</code>.
            </p>
             <p className="text-sm mb-2">
                O ponto crucial aqui não é o erro em si, mas o fato de que o servidor <strong>tentou</strong> fazer uma requisição para <code>localhost</code>. Isso confirma que o servidor está resolvendo e acessando URLs fornecidas pelo usuário sem validação. Um invasor usaria isso para mapear a rede interna do servidor.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> O servidor confia e acessa qualquer URL fornecida pelo cliente. Uma API segura validaria a URL contra uma lista de permissões (allow-list) de domínios confiáveis e bloquearia qualquer tentativa de acesso a endereços de IP locais ou privados.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Sempre valide as URLs fornecidas pelo usuário no lado do servidor. A abordagem mais segura é usar uma lista de permissões (allow-list) de domínios e protocolos permitidos. Bloqueie todas as requisições para IPs de rede interna e privada.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API7:2023 – Server Side Request Forgery
                </h1>
                <p className="text-lg text-gray-300">Forçar a API a fazer uma solicitação maliciosa em nome do servidor.</p>
            </header>

            <p className="text-gray-300">
                Sua missão: Forneça URLs que apontem para serviços internos, como <strong><code>http://localhost/admin</code></strong> ou <strong><code>http://169.254.169.254/latest/meta-data</code></strong>, para simular uma sondagem na rede interna.
            </p>

            <APIInteraction
                method="POST"
                path="/api/import-avatar"
                body={body}
                onBodyChange={setBody}
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
            />
        </div>
    );
};