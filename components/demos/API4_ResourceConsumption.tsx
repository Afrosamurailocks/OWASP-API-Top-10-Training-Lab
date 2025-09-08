import React, { useState, useCallback } from 'react';
import { APIInteraction } from '../APIInteraction';
import { fetchLogs_ResourceConsumption } from '../../services/api';

export const API4_ResourceConsumption: React.FC = () => {
    const [limit, setLimit] = useState('10000');

    const handleRequest = useCallback(async () => {
        const numLimit = parseInt(limit, 10);
        if (isNaN(numLimit) || numLimit <= 0) {
            throw new Error("Por favor, insira um número válido e positivo.");
        }
        return await fetchLogs_ResourceConsumption(numLimit);
    }, [limit]);

    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                A requisição foi enviada com o parâmetro <code>limit={limit}</code>. A API processou a solicitação e retornou <code>200 OK</code>.
            </p>
            <p className="text-sm mb-2">
                Observe o campo <code>"responseTime"</code> na resposta. Um valor alto indica que o servidor está sob estresse para atender a uma solicitação tão grande. Em um sistema real, múltiplas requisições como essa poderiam derrubar o serviço para todos os usuários.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> A API não impõe um limite máximo para o parâmetro <code>limit</code>. Uma API segura deveria definir um teto (ex: 100) e retornar um erro <code>400 Bad Request</code> se o limite solicitado for muito alto, protegendo os recursos do servidor.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Implemente uma limitação de taxa (rate limiting) rigorosa em todos os endpoints. Para parâmetros que controlam o número de registros retornados (como <code>limit</code> ou <code>pageSize</code>), imponha um valor máximo no lado do servidor. Retorne um erro 400 se o cliente solicitar mais do que o permitido.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API4:2023 – Unrestricted Resource Consumption
                </h1>
                <p className="text-lg text-gray-300">Permitir que um cliente consuma recursos excessivos, levando à negação de serviço.</p>
            </header>

            <p className="text-gray-300">
                Sua missão: Solicite um número muito grande de registros (ex: <strong>10000</strong> ou mais) ajustando o parâmetro `limit`. Observe o aumento do tempo de resposta simulado na resposta.
            </p>

            <APIInteraction
                method="GET"
                path="/api/logs?limit="
                editablePart={limit}
                onEditablePartChange={setLimit}
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
            />
        </div>
    );
};