import React, { useState, useCallback, useContext } from 'react';
import { APIInteraction } from '../APIInteraction';
import { promoteUser_BFLA } from '../../services/api';
import { UserContext } from '../../context/UserContext';

export const API5_Bfla: React.FC = () => {
    const { currentUser } = useContext(UserContext);
    const [targetId] = useState('101');

    const handleRequest = useCallback(async () => {
        // VULNERABILIDADE: Chamando uma função de nível de admin sem ser um admin.
        return await promoteUser_BFLA(targetId);
    }, [targetId]);

    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                Você está logado como <strong>{currentUser?.name}</strong>, que tem o cargo de <strong>{currentUser?.role}</strong>. A requisição <code>POST</code> foi enviada para o endpoint administrativo <code>/api/users/{targetId}/promote</code>.
            </p>
            <p className="text-sm mb-2">
                A API respondeu com um status <code>200 OK</code> e uma mensagem de sucesso.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> A sua requisição deveria ter sido rejeitada com um erro <code>403 Forbidden</code>, pois seu usuário não tem permissões de administrador. O sucesso da operação confirma que o endpoint não está verificando as permissões do usuário, permitindo que qualquer um execute ações administrativas.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    O mecanismo de autorização deve negar por padrão. Cada função de negócios deve, antes de sua execução, verificar se o cargo ou as permissões do usuário (extraídos do token de acesso) são adequados para realizar tal ação. Use middlewares ou decoradores para aplicar essas verificações de forma consistente.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API5:2023 – Broken Function Level Authorization
                </h1>
                <p className="text-lg text-gray-300">Permitir que usuários acessem funções que não deveriam.</p>
            </header>

             <p className="text-gray-300">
                Sua missão: Envie a requisição para o endpoint administrativo abaixo. Como um usuário com cargo de "{currentUser?.role}", esta ação deveria falhar, mas devido à BFLA, ela terá sucesso.
            </p>

            <APIInteraction
                method="POST"
                path={`/api/users/${targetId}/promote`}
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
            />
        </div>
    );
};