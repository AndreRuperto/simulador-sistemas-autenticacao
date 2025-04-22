# Simulador de Autômatos para Sistemas de Autenticação

## Sobre o Projeto

Este projeto é um simulador interativo que demonstra como autômatos finitos podem modelar sistemas de autenticação, incluindo processos de cadastro, login e verificação em duas etapas (2FA). A aplicação oferece visualizações gráficas de Autômatos Finitos Determinísticos (AFD) e Autômatos Finitos Não-Determinísticos (AFN), permitindo explorar os diferentes fluxos e estados de um sistema de autenticação moderno.

## Funcionalidades

- **Simulação Visual de Autômatos**: Visualize e interaja com autômatos que representam sistemas de autenticação
- **Experiência de Usuário Realista**: Interface que simula uma experiência real de cadastro, login e verificação
- **Comparação AFD vs AFN**: Observe as diferenças entre abordagens determinísticas e não-determinísticas
- **Histórico de Transições**: Acompanhe a sequência de estados e transições realizadas

## Tecnologias Utilizadas

- **React + TypeScript**: Para criar uma interface de usuário robusta e bem tipada
- **Vite**: Como ferramenta de build e desenvolvimento
- **Tailwind CSS**: Para estilização eficiente e responsiva
- **shadcn/ui**: Componentes de UI modulares e personalizáveis
- **Lucide React**: Para ícones expressivos e consistentes

## Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (recomendado v16+)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd automato-auth-simulator
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse a aplicação**
   
   Abra seu navegador e acesse `http://localhost:8080`

## Como Usar o Simulador

1. **Modo Experiência do Usuário**: Interaja com uma interface real de autenticação
2. **Simulador Lado a Lado**: Compare os modelos AFD e AFN simultaneamente
3. **Apenas AFD**: Foque no modelo determinístico mais simples
4. **Apenas AFN**: Explore o modelo não-determinístico com múltiplos caminhos

## Estrutura do Projeto

```
src/
├── components/        # Componentes React reutilizáveis
│   ├── ui/            # Componentes UI base (shadcn/ui)
│   ├── AutomatonVisualizer.tsx    # Visualizador dos autômatos
│   ├── AuthControls.tsx           # Controles de interação
│   ├── AuthSimulator.tsx          # Componente principal do simulador
│   └── AuthUserExperience.tsx     # Interface de usuário realista
├── hooks/             # Hooks React customizados
├── pages/             # Páginas da aplicação
└── lib/               # Utilitários e funções auxiliares
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Contato

Para dúvidas, sugestões ou colaborações, fique a vontade para entrar em contato!