import React from 'react';
import { APIInteraction, APIInteractionResponse } from '../APIInteraction';
import { triggerError_Misconfig } from '../../services/api';

export const API8_SecurityMisconfig: React.FC = () => {

    const handleRequest = async (): Promise<APIInteractionResponse> => {
        try {
            await triggerError_Misconfig();
            // This part should not be reached
            return { status: 200, body: { message: "Nenhum erro foi gerado." } };
        } catch (e: unknown) {
            // VULNERABILITY FIXED: Instead of leaking details, return a generic message.
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'Ocorreu um erro interno. Por favor, tente novamente mais tarde.' },
                isError: true,
            };
        }
    };
    
    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                A requisição simulou um erro interno no servidor, e a API respondeu com um status <code>500 Internal Server Error</code>.
            </p>
             <p className="text-sm mb-2">
                Observe o corpo da resposta. Ele contém apenas uma mensagem de erro genérica: <code>"Ocorreu um erro interno. Por favor, tente novamente mais tarde."</code>.
            </p>
            <p className="font-semibold text-green-300 bg-green-900/50 p-3 rounded-md text-sm">
                <strong>Implementação Segura:</strong> Este é o comportamento correto. A API não vaza nenhum detalhe interno. Uma API vulnerável, por outro lado, teria retornado um rastreamento de pilha (stack trace) completo, expondo versões de software, nomes de arquivos e detalhes da infraestrutura, informações valiosas para um invasor.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                   Configure seu ambiente para nunca expor detalhes de erros em produção. Implemente um tratamento de exceções global que capture todos os erros, registre os detalhes completos em um local seguro no servidor (para depuração) e retorne apenas uma mensagem de erro genérica e um código de status HTTP apropriado para o cliente.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API8:2023 – Security Misconfiguration
                </h1>
                <p className="text-lg text-gray-300">Expor informações sensíveis ou funcionalidades por meio de configurações inadequadas.</p>
            </header>

            <p className="text-gray-300">
                Sua missão: Clique em "Enviar Requisição" para acionar um erro no servidor. Observe a mensagem de erro genérica que é retornada. Este módulo agora demonstra a <strong>forma correta</strong> de tratar erros, evitando o vazamento de informações.
            </p>

            <APIInteraction
                method="GET"
                path="/api/trigger-error"
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
            />
        </div>
    );
};