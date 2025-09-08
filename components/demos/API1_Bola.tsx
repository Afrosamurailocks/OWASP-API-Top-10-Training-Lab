import React, { useState, useCallback, useContext, useEffect } from 'react';
import { APIInteraction } from '../APIInteraction';
import { fetchUserData_BOLA } from '../../services/api';
import { UserProfileCard } from '../UserProfileCard';
import type { User } from '../../types';
import { UserContext } from '../../context/UserContext';

export const API1_Bola: React.FC = () => {
    const { currentUser } = useContext(UserContext);
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState<Partial<User> | null>(null);
    
    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.id);
        }
    }, [currentUser]);

    const handleRequest = useCallback(async () => {
        return await fetchUserData_BOLA(userId);
    }, [userId]);

    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                Você está logado como <strong>{currentUser?.name}</strong>. Sua primeira requisição para seu próprio ID (<code>/users/{currentUser?.id}</code>) retornou um status <code>200 OK</code>, o que é esperado.
            </p>
            <p className="text-sm mb-2">
                Agora, observe a resposta quando você solicitou um ID diferente (ex: <code>/users/202</code>). A API respondeu novamente com <code>200 OK</code> e os dados completos do outro usuário.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> Uma API segura deveria ter retornado um erro <code>403 Forbidden</code> (se você não tem permissão) ou <code>404 Not Found</code> (para ocultar a existência do usuário). O recebimento de um <code>200 OK</code> com dados de outro usuário confirma a falha de BOLA.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Para cada requisição que acessa um recurso, o backend deve sempre verificar se o usuário autenticado (identificado pelo token JWT, por exemplo) tem permissão para acessar o objeto específico solicitado. Nunca confie no ID enviado pelo cliente sem uma verificação de autorização explícita na lógica de negócios.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API1:2023 – Broken Object Level Authorization
                </h1>
                <p className="text-lg text-gray-300">Permitir que usuários acessem recursos que não deveriam.</p>
            </header>

            <div className="space-y-4">
                <p className="text-gray-300">
                    Sua missão: Altere o ID na URL da requisição para acessar perfis de outros usuários (ex: <strong>202</strong>, <strong>303</strong>) e observe como a API não consegue impor as restrições de acesso.
                </p>
            </div>

            <APIInteraction
                method="GET"
                path="/users/"
                editablePart={userId}
                onEditablePartChange={setUserId}
                onSendRequest={handleRequest}
                analysisPanel={<AnalysisPanel />}
                onRequestStart={() => setUserData(null)}
                onSuccess={(body) => setUserData(body as User)}
            />

            {userData && (
                <div className="mt-8 flex justify-center">
                    <UserProfileCard user={userData} />
                </div>
            )}
        </div>
    );
};