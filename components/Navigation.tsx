import React from 'react';

export interface Vulnerability {
    id: string;
    title: string;
    fullName: string;
}

export const vulnerabilities: Vulnerability[] = [
    { id: 'API1', title: 'BOLA', fullName: 'Broken Object Level Authorization' },
    { id: 'API2', title: 'Broken Authentication', fullName: 'Broken Authentication' },
    { id: 'API3', title: 'BOPLA', fullName: 'Broken Object Property Level Authorization' },
    { id: 'API4', title: 'Resource Consumption', fullName: 'Unrestricted Resource Consumption' },
    { id: 'API5', title: 'BFLA', fullName: 'Broken Function Level Authorization' },
    { id: 'API6', title: 'Sensitive Flows', fullName: 'Unrestricted Access to Sensitive Business Flows' },
    { id: 'API7', title: 'SSRF', fullName: 'Server Side Request Forgery' },
    { id: 'API8', title: 'Security Misconfig', fullName: 'Security Misconfiguration' },
    { id: 'API9', title: 'Inventory Management', fullName: 'Improper Inventory Management' },
    { id: 'API10', title: 'Unsafe Consumption', fullName: 'Unsafe Consumption of APIs' },
];

interface NavigationProps {
    activeVulnerabilityId: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeVulnerabilityId }) => {
    return (
        <aside className="w-64 bg-black/30 backdrop-blur-lg p-4 flex flex-col border-r border-white/10">
            <h1 className="text-xl font-bold text-white tracking-wider text-center mb-6">OWASP API Top 10</h1>
            <nav>
                <ul>
                    {vulnerabilities.map((vuln) => (
                        <li key={vuln.id}>
                            <a
                                href={`#${vuln.id}`}
                                className={`w-full block text-left p-3 rounded-md transition-colors duration-200 text-sm ${
                                    activeVulnerabilityId === vuln.id
                                        ? 'bg-sky-500/80 text-white font-semibold shadow-lg'
                                        : 'text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <span className="font-bold">{vuln.id}:</span> {vuln.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <footer className="mt-auto text-center text-xs text-gray-500">
                <p>Laboratório de Treinamento Interativo</p>
                <a href="#testing" className="mt-4 block text-sky-400 hover:text-sky-300 text-sm">
                    Executar Testes
                </a>
            </footer>
        </aside>
    );
};
