import React, { useState, useEffect } from 'react';
import { Navigation, vulnerabilities } from './components/Navigation';

// Importa dinamicamente todos os componentes de demonstração
import { API1_Bola } from './components/demos/API1_Bola';
import { API2_BrokenAuthentication } from './components/demos/API2_BrokenAuthentication';
import { API3_Bopla } from './components/demos/API3_Bopla';
import { API4_ResourceConsumption } from './components/demos/API4_ResourceConsumption';
import { API5_Bfla } from './components/demos/API5_Bfla';
import { API6_SensitiveFlows } from './components/demos/API6_SensitiveFlows';
import { API7_Ssrf } from './components/demos/API7_Ssrf';
import { API8_SecurityMisconfig } from './components/demos/API8_SecurityMisconfig';
import { API9_InventoryManagement } from './components/demos/API9_InventoryManagement';
import { API10_UnsafeConsumption } from './components/demos/API10_UnsafeConsumption';
import { PhishingPage } from './components/PhishingPage';
import { TestRunner } from './components/TestRunner';


const vulnerabilityComponents: Record<string, React.FC> = {
  'API1': API1_Bola,
  'API2': API2_BrokenAuthentication,
  'API3': API3_Bopla,
  'API4': API4_ResourceConsumption,
  'API5': API5_Bfla,
  'API6': API6_SensitiveFlows,
  'API7': API7_Ssrf,
  'API8': API8_SecurityMisconfig,
  'API9': API9_InventoryManagement,
  'API10': API10_UnsafeConsumption,
};

const getHash = () => window.location.hash.replace('#', '');

const App: React.FC = () => {
  const [activeHash, setActiveHash] = useState(getHash());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(getHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  let ActiveComponent: React.FC | null = null;

  if (activeHash === 'phishing') {
    ActiveComponent = PhishingPage;
  } else if (activeHash === 'testing') {
    ActiveComponent = TestRunner;
  } else {
    const activeVulnerability = vulnerabilities.find(v => v.id === activeHash);
    if (activeVulnerability) {
      ActiveComponent = vulnerabilityComponents[activeVulnerability.id];
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center" 
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')" }}>
      </div>
      <div className="fixed inset-0 z-[-1] bg-black/80"></div>
      
      <div className="flex min-h-screen font-sans text-white">
        <Navigation activeVulnerabilityId={activeHash} />
        
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Laboratório de Treinamento OWASP API Top 10
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Selecione uma vulnerabilidade no menu à esquerda para começar.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Cada módulo oferece uma explicação e uma demonstração interativa da falha de segurança.
              </p>
            </div>
          )}
        </main>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </>
  );
};

export default App;
