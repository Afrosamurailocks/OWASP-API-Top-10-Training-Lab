import React from 'react';

export const PhishingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in text-gray-200">
      <div className="max-w-3xl bg-gray-800/50 backdrop-blur-md border border-red-500/50 rounded-lg p-8 shadow-2xl">
        <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h1 className="text-3xl font-bold mt-4 text-red-300">Atenção: Risco de Phishing Simulado</h1>
        <p className="mt-4 text-lg">
          Você foi redirecionado para esta página porque a aplicação consumiu uma API de terceiros de forma insegura.
        </p>
        <div className="text-left mt-6 space-y-4">
          <p>
            No cenário da <strong>API10: Unsafe Consumption of APIs</strong>, nossa aplicação confiou cegamente em uma URL de redirecionamento fornecida por um serviço parceiro. Se esse serviço estivesse comprometido, um invasor poderia ter enviado você para um site malicioso para roubar suas credenciais.
          </p>
          <h2 className="text-xl font-semibold text-sky-300 pt-4 border-t border-gray-600">O que é Phishing?</h2>
          <p>
            Phishing é uma técnica de engenharia social usada para enganar usuários e obter informações sensíveis como nomes de usuário, senhas e detalhes de cartão de crédito. Geralmente, se passa por uma entidade confiável em uma comunicação eletrônica.
          </p>
          <h2 className="text-xl font-semibold text-sky-300 pt-4 border-t border-gray-600">Como se Proteger?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Verifique o Domínio:</strong> Sempre verifique o endereço do site na barra do navegador. Desconfie de domínios que parecem estranhos ou têm erros de digitação.</li>
            <li><strong>Procure por HTTPS:</strong> Sites legítimos usam conexões seguras (o cadeado na barra de endereço).</li>
            <li><strong>Desconfie de Urgência:</strong> Ataques de phishing frequentemente criam um senso de urgência para fazer você agir sem pensar.</li>
            <li><strong>Não Clique em Links Suspeitos:</strong> Evite clicar em links ou baixar anexos de e-mails ou mensagens inesperadas.</li>
          </ul>
        </div>
        <div className="mt-8">
          <a
            href="#API10"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Voltar para o Laboratório
          </a>
        </div>
      </div>
    </div>
  );
};
