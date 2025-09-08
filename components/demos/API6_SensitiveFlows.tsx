import React, { useState, useRef, useEffect } from 'react';

interface LogEntry {
    id: number;
    status: number;
    message: string;
}

export const API6_SensitiveFlows: React.FC = () => {
    const [email] = useState('bruno.costa@example.com');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs]);
    
    const handleFlood = () => {
        setIsLoading(true);
        setLogs([]);
        let counter = 0;
        
        const interval = setInterval(() => {
            setLogs(prev => [...prev, { id: counter + 1, status: 200, message: `Password reset sent to ${email}` }]);
            counter++;
            if (counter >= 20) {
                clearInterval(interval);
                setIsLoading(false);
            }
        }, 100);
    };

    const AnalysisPanel = () => (
        <div className="bg-gray-800 p-4 rounded-md mt-4 border border-gray-700">
            <h4 className="font-bold text-lg mb-2 text-sky-300">Análise dos Logs</h4>
            <p className="text-sm mb-2">
                Observe o log de requisições. Todas as 20 tentativas de redefinição de senha para o mesmo usuário receberam uma resposta simulada de <code>200 OK</code>.
            </p>
            <p className="font-semibold text-yellow-300 bg-yellow-900/50 p-3 rounded-md text-sm">
                <strong>Vulnerabilidade:</strong> A API não implementou limitação de taxa (rate limiting) em um fluxo de negócios sensível. Um sistema seguro deveria permitir apenas algumas tentativas em um curto período e depois começar a bloquear as requisições com um status <code>429 Too Many Requests</code>, protegendo contra abuso e bombardeio de e-mails.
            </p>
             <div className="mt-4">
                <h5 className="font-semibold text-green-400 mb-2">Melhores Práticas para Mitigação</h5>
                <p className="text-sm bg-green-900/30 p-3 rounded-md">
                    Identifique fluxos de negócios críticos (login, redefinição de senha, checkout) e aplique uma limitação de taxa mais rigorosa a eles. Além disso, use mecanismos como CAPTCHA para distinguir entre usuários humanos e bots, prevenindo o abuso automatizado.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    API6:2023 – Unrestricted Access to Sensitive Business Flows
                </h1>
                <p className="text-lg text-gray-300">Expor um fluxo de negócios a uma exploração automatizada.</p>
            </header>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 space-y-4">
                <h3 className="font-semibold text-lg text-white">Cenário de Teste</h3>
                <p className="text-gray-300 text-sm">
                   O endpoint <code>POST /api/reset-password</code> não possui limitação de taxa. Um invasor pode automatizar o envio de milhões de solicitações.
                </p>
                <p className="font-semibold text-sky-300">
                    Sua Missão: Clique no botão para simular o envio rápido de solicitações de redefinição de senha. Observe que a API não bloqueia você, permitindo um número ilimitado de tentativas.
                </p>

                <div className="pt-4">
                    <button onClick={handleFlood} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 h-10">
                        {isLoading ? 'Inundando...' : 'Iniciar Inundação de Solicitações'}
                    </button>
                </div>
            </div>
            
            {(logs.length > 0 || isLoading) && (
                <div className="space-y-4">
                    <div ref={logsContainerRef} className="h-64 bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-y-auto border border-gray-700">
                        <p className="text-gray-400 font-sans font-semibold mb-2">Log de Respostas da API:</p>
                        {logs.map(log => (
                           <p key={log.id} className="text-green-400">
                                <span className="text-gray-500 mr-2">[{log.id.toString().padStart(2, '0')}]</span>
                                Response: <span className="font-bold">{log.status} OK</span> - "{log.message}"
                           </p>
                        ))}
                         {isLoading && <p className="text-yellow-400 animate-pulse">Enviando requisições...</p>}
                    </div>
                    {!isLoading && <AnalysisPanel />}
                </div>
            )}
        </div>
    );
};