import React, { useState, useCallback } from 'react';
import { APIInteraction } from '../APIInteraction';
import { fetchUserData_BOPLA } from '../../services/api';
import { UserProfileCard } from '../UserProfileCard';
import type { User } from '../../types';

export const API3_Bopla: React.FC = () => {
    const [userId, setUserId] = useState('303');
    const [userData, setUserData] = useState<Partial<User> | null>(null);

    const handleRequest = useCallback(async () => {
        // VULNERABILIDADE: A API deveria filtrar campos como `salary` para solicitantes não-admin.
        return await fetchUserData_BOPLA(userId);
    }, [userId]);
    
    const AnalysisPanel = () => (
        <div>
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise de Logs e Resposta</h4>
            <p className="text-sm mb-2">
                A API retornou o objeto de usuário completo, incluindo dados que deveriam ser confidenciais. Compare a resposta recebida com o que uma API segura deveria retornar para um usuário não autorizado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <h5 className="font-semibold text-red-400 mb-2">Resposta Vulnerável (Recebida)</h5>
                    <pre className="bg-red-900/30 p-3 rounded-md text-xs text-red-200 whitespace-pre-wrap h-full">
                        {`{
  "id": "303",
  "name": "Carla Dias",
  "email": "carla.dias@example.com",
  "role": "Admin",
  "lastLogin": "...",
  "department": "TI",
  "salary": 120000,
  "personalNotes": "Planejar a migração do servidor..."
}`}
                    </pre>
                </div>
                <div>
                    <h5 className="font-semibold text-green-400 mb-2">Resposta Segura (Esperada)</h5>
                    <pre className="bg-green-900/30 p-3 rounded-md text-xs text-green-200 whitespace-pre-wrap h-full">
                        {`{
  "id": "303",
  "name": "Carla Dias",
  "email": "carla.dias@example.com",
  "role": "Admin",
  "lastLogin": "...",
  "department": "TI"
}`}
                    </pre>
                </div>
            </div>

            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm mt-4">
                <strong>Vulnerabilidade:</strong> A API está retornando o objeto de usuário completo do banco de dados sem filtrar as propriedades com base nas permissões do solicitante. Uma API segura removeria os campos sensíveis antes de enviar a resposta para um usuário não autorizado.
            </p>

            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Nunca exponha objetos do banco de dados diretamente. Use padrões como DTOs (Data Transfer Objects) ou schemas para definir explicitamente quais campos devem ser retornados em cada contexto. A lógica de negócios deve filtrar as propriedades sensíveis com base no cargo e nas permissões do usuário solicitante.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API3:2023 – Broken Object Property Level Authorization
                </h1>
                <p className="text-lg text-gray-300">Expor propriedades de objetos que o usuário não deveria ver.</p>
            </header>
            
            <p className="text-gray-300">
                Sua missão: Busque o perfil de um usuário (ex: ID <strong>303</strong>) e inspecione a resposta JSON para encontrar dados sensíveis (salário, notas) que não deveriam estar visíveis.
            </p>

            <APIInteraction
                method="GET"
                path="/api/users/"
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