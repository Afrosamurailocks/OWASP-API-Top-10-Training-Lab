import React, { useState } from 'react';

export const API10_UnsafeConsumption: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleRedirect = () => {
        setIsRedirecting(true);
        setLogs([]);
        
        setTimeout(() => {
           setLogs(prev => [...prev, '1. [CLIENTE] Requisição enviada para a API do parceiro...']);
        }, 500);
        
        setTimeout(() => {
           setLogs(prev => [...prev, `2. [PARCEIRO] API respondeu com uma URL de redirecionamento maliciosa.`]);
        }, 1200);

        setTimeout(() => {
            setLogs(prev => [...prev, '3. [CLIENTE] VULNERABILIDADE: Redirecionando para página de Phishing simulada...']);
            window.location.hash = 'phishing';
            // A navegação ocorrerá, mas definimos o estado de volta para consistência
            setIsRedirecting(false);
        }, 2000);
    };
    
    const AnalysisPanel = () => (
        <div className="bg-gray-800 p-4 rounded-md mt-4 border border-gray-700">
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise dos Logs</h4>
            <p className="text-sm mb-2">
                O log mostra o fluxo exato. O passo 3 é o ponto crítico. Nossa aplicação recebeu uma URL de uma fonte externa (a API do parceiro) e confiou nela cegamente, redirecionando o navegador do usuário.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> A aplicação não valida os dados recebidos da API de terceiros. Se a API do parceiro for comprometida, um invasor pode nos fornecer URLs para sites de phishing. A solução correta é validar a URL de redirecionamento recebida contra uma lista de permissões (allow-list) de domínios conhecidos e seguros.
            </p>
            <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                   Trate os dados de APIs de terceiros com o mesmo rigor que os dados de entrada do usuário. Valide, higienize e verifique todos os dados recebidos. Para redirecionamentos, sempre valide a URL recebida contra uma lista de permissões (allow-list) de domínios seguros e aprovados.
                </p>
            </div>
        </div>
    );


    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API10:2023 – Unsafe Consumption of APIs
                </h1>
                <p className="text-lg text-gray-300">Confiar em dados de APIs de terceiros sem a devida validação.</p>
            </header>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 space-y-4">
                <h3 className="font-semibold text-lg text-white">Cenário de Teste</h3>
                <p className="text-gray-300 text-sm">
                    Nossa aplicação se integra a um "serviço de parceiro" que nos fornece uma URL de redirecionamento. Nossa aplicação não valida este URL contra uma lista de permissões.
                </p>
                <p className="font-semibold text-sky-300">
                    Sua Missão: Clique no botão para iniciar o fluxo. Se a API do parceiro fosse comprometida, ela poderia retornar uma URL para um site de phishing. Observe o log para entender como a confiança cega leva ao redirecionamento inseguro.
                </p>

                <div className="pt-4">
                    <button onClick={handleRedirect} disabled={isRedirecting} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50">
                        {isRedirecting ? 'Redirecionando...' : 'Login com Serviço de Parceiro'}
                    </button>
                </div>
            </div>
            
            {(logs.length > 0 || isRedirecting) && (
                 <div className="space-y-4">
                    <div className="h-48 bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-y-auto border border-gray-700">
                        <p className="text-gray-400 font-sans font-semibold mb-2">Log de Interação com a API:</p>
                        {logs.map((log, i) => (
                           <p key={i} className="text-gray-300">
                               {log.includes('VULNERABILIDADE') ? <span className="text-red-400">{log}</span> : log}
                           </p>
                        ))}
                         {isRedirecting && <p className="text-yellow-400 animate-pulse">Aguardando resposta do parceiro...</p>}
                    </div>
                    {!isRedirecting && logs.length > 0 && <AnalysisPanel />}
                </div>
            )}
        </div>
    );
};
