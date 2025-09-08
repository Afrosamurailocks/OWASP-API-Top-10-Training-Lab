import React, { useState, useCallback } from 'react';
import { APIInteraction } from '../APIInteraction';
import { fetchUserData_v1, fetchUserData_v2 } from '../../services/api';
import { UserProfileCard } from '../UserProfileCard';
import type { User } from '../../types';

export const API9_InventoryManagement: React.FC = () => {
    const [userIdV1, setUserIdV1] = useState('303');
    const [userIdV2, setUserIdV2] = useState('303');
    const [userDataV1, setUserDataV1] = useState<Partial<User> | null>(null);
    const [userDataV2, setUserDataV2] = useState<Partial<User> | null>(null);

    const handleRequestV1 = useCallback(async () => {
        return await fetchUserData_v1(userIdV1);
    }, [userIdV1]);

    const handleRequestV2 = useCallback(async () => {
        return await fetchUserData_v2(userIdV2);
    }, [userIdV2]);

    const AnalysisPanel = () => (
        <div className="bg-gray-800 p-4 rounded-md mt-6 border border-gray-700">
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise e Comparação</h4>
            <p className="text-sm mb-2">
                Compare as respostas das duas versões da API. O endpoint <code>/v2</code> (o correto e documentado) filtra corretamente os dados sensíveis como <code>salary</code> e <code>personalNotes</code>.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> O endpoint <code>/v1</code>, uma versão antiga e esquecida, ainda está ativo e não possui os mesmos controles de segurança da versão mais recente. Ele vaza todos os dados do usuário. Invasores frequentemente procuram por esses endpoints "sombra" ou de depuração para encontrar um caminho mais fácil para dados sensíveis.
            </p>
             <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Mantenha um inventário atualizado de todas as suas APIs e seus ambientes. Implemente um processo de desativação para versões antigas, garantindo que sejam removidas ou, se necessário, protegidas com os mesmos controles de segurança da versão mais recente. Bloqueie o acesso público a endpoints de desenvolvimento ou teste.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API9:2023 – Improper Inventory Management
                </h1>
                <p className="text-lg text-gray-300">Confiar em endpoints de API antigos ou não documentados que carecem de controles de segurança.</p>
            </header>
            
            <p className="text-gray-300">
                Sua missão: Faça requisições para o endpoint <code>/v1</code> (antigo e inseguro) e para o <code>/v2</code> (novo e seguro). Compare as respostas e observe como a versão antiga vaza dados que a nova versão protege.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-semibold text-xl text-red-400 mb-2">API Antiga (v1)</h3>
                     <APIInteraction
                        method="GET"
                        path="/api/v1/users/"
                        editablePart={userIdV1}
                        onEditablePartChange={setUserIdV1}
                        onSendRequest={handleRequestV1}
                        onRequestStart={() => setUserDataV1(null)}
                        onSuccess={(body) => setUserDataV1(body as User)}
                    />
                     {userDataV1 && (
                        <div className="mt-6">
                            <UserProfileCard user={userDataV1} />
                        </div>
                    )}
                </div>
                <div>
                     <h3 className="font-semibold text-xl text-green-400 mb-2">API Nova (v2)</h3>
                     <APIInteraction
                        method="GET"
                        path="/api/v2/users/"
                        editablePart={userIdV2}
                        onEditablePartChange={setUserIdV2}
                        onSendRequest={handleRequestV2}
                        onRequestStart={() => setUserDataV2(null)}
                        onSuccess={(body) => setUserDataV2(body as User)}
                    />
                    {userDataV2 && (
                        <div className="mt-6">
                            <UserProfileCard user={userDataV2} />
                        </div>
                    )}
                </div>
            </div>
             <AnalysisPanel />
        </div>
    );
};