# Laboratório de Treinamento OWASP API Top 10

Uma aplicação de desktop interativa, construída com Electron e React, para demonstrar e ensinar sobre as 10 principais vulnerabilidades de API da OWASP em um ambiente de laboratório seguro.

## Funcionalidades

- **Demonstrações Interativas**: Explore cada uma das 10 principais vulnerabilidades de API da OWASP com exemplos práticos.
- **Ambiente Seguro**: Simula falhas de API sem risco real, permitindo a exploração segura.
- **Análise Detalhada**: Cada demonstração inclui uma análise da vulnerabilidade e melhores práticas para mitigação.
- **Suíte de Testes Integrada**: Execute uma bateria completa de testes para verificar a lógica de negócios simulada.
- **Aplicação Local**: Funciona como uma aplicação de desktop para fácil acesso e uso offline.

## Tecnologias Utilizadas

- **Electron**: Para empacotar a aplicação web como uma aplicação de desktop multiplataforma.
- **React**: Para construir a interface de usuário interativa.
- **TypeScript**: Para adicionar tipos estáticos e melhorar a qualidade do código.
- **Tailwind CSS**: Para uma estilização rápida e responsiva.

## Começando

Siga estas instruções para obter uma cópia do projeto e executá-lo em sua máquina local.

### Pré-requisitos

Você precisará ter o [Node.js](https://nodejs.org/) (que inclui o npm) instalado em seu sistema.

### Instalação

1.  **Clone o repositório:**
    Primeiro, você precisa clonar este repositório para a sua máquina local. Substitua `[URL_DO_SEU_REPOSITORIO]` pelo URL real do seu repositório no GitHub.
    ```sh
    git clone [URL_DO_SEU_REPOSITORIO]
    cd owasp-api-lab
    ```

2.  **Instale as dependências:**
    Use o npm (Node Package Manager) para instalar as dependências do projeto, incluindo o Electron.
    ```sh
    npm install
    ```

## Executando a Aplicação

Após a instalação, você pode iniciar a aplicação de desktop com um único comando.

```sh
npm start
```

Este comando iniciará o Electron, que abrirá uma janela de desktop carregando o laboratório de treinamento.

## Estrutura do Projeto

```
/
├── components/         # Componentes React, incluindo as demonstrações de cada API
├── services/           # Lógica de API simulada
├── tests/              # Arquivos de teste para a suíte integrada
├── utils/              # Funções auxiliares, como o executor de testes
├── electron.js         # Ponto de entrada principal do Electron (processo principal)
├── index.html          # Arquivo HTML principal
├── index.tsx           # Ponto de entrada do React (processo de renderização)
├── package.json        # Define os scripts e dependências do projeto
└── README.md           # Este arquivo
```

## Licença

Este projeto está licenciado sob a Licença MIT.