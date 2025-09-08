import React, { useState, useEffect } from 'react';
import { runAllTests } from '../tests';
import type { TestResult } from '../utils/test-helpers';

const ResultIcon: React.FC<{ success: boolean }> = ({ success }) => {
    if (success) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
};

export const TestRunner: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        const run = async () => {
            setRunning(true);
            const testResults = await runAllTests();
            setResults(testResults);
            setRunning(false);
        };
        run();
    }, []);

    const passedCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    const totalCount = results.length;

    const suites = results.reduce((acc, result) => {
        const suiteName = result.suite;
        if (!acc[suiteName]) {
            acc[suiteName] = { passed: 0, failed: 0, tests: [] };
        }
        acc[suiteName].tests.push(result);
        if (result.success) {
            acc[suiteName].passed++;
        } else {
            acc[suiteName].failed++;
        }
        return acc;
    }, {} as Record<string, { passed: number; failed: number, tests: TestResult[] }>);

    if (running) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
                 <h1 className="text-2xl font-bold tracking-tight text-gray-300 mt-6">
                    Executando a suíte de testes...
                 </h1>
             </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
             <header className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    Resultados da Bateria de Testes
                </h1>
                <p className="text-lg text-gray-300">Análise completa da lógica de negócios e simulações de API.</p>
            </header>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-lg">
                    <div className="flex items-center">
                        <span className="font-bold text-green-400 mr-2">{passedCount}</span>
                        <span className="text-gray-300">Aprovados</span>
                    </div>
                     <div className="flex items-center">
                        <span className="font-bold text-red-400 mr-2">{failedCount}</span>
                        <span className="text-gray-300">Reprovados</span>
                    </div>
                     <div className="flex items-center">
                        <span className="font-bold text-gray-300 mr-2">{totalCount}</span>
                        <span className="text-gray-300">Total</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(suites).map(([suiteName, suiteData]) => (
                    <div key={suiteName} className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700">
                        <header className={`p-4 flex justify-between items-center border-b border-gray-700 ${suiteData.failed > 0 ? 'bg-red-900/30' : 'bg-green-900/30'}`}>
                            <h3 className="font-bold text-lg">{suiteName}</h3>
                            <div className="flex items-center space-x-4 text-sm font-semibold">
                                <span className="text-green-300">{suiteData.passed} Aprovados</span>
                                <span className="text-red-300">{suiteData.failed} Reprovados</span>
                            </div>
                        </header>
                        <ul className="divide-y divide-gray-700">
                            {suiteData.tests.map((test, index) => (
                                <li key={index} className="p-4">
                                    <div className="flex items-start">
                                        <ResultIcon success={test.success} />
                                        <div className="ml-3 flex-1">
                                            <p className={`text-sm ${test.success ? 'text-gray-300' : 'text-red-300 font-semibold'}`}>{test.test}</p>
                                            {!test.success && (
                                                <div className="mt-2 text-xs font-mono bg-black/50 text-red-200 p-3 rounded">
                                                    <pre className="whitespace-pre-wrap break-all">Error: {test.error}</pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
