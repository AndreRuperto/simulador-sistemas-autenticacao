import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Info, Key, Lock, LockKeyhole, RefreshCw, Shield, Smartphone, User, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthSimulator = () => {
  // Todos os estados e lógica do seu código original, mais a nova funcionalidade de cadastro
  
  // Estados para o formulário de cadastro
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cadastroSuccess, setCadastroSuccess] = useState(false);
  const [cadastroError, setCadastroError] = useState("");
  
  // Definições dos autômatos incluindo estados de cadastro
  const dfaStates = [
    { id: "q-2", x: 50, y: 150, isInitial: true, label: "Início", icon: <UserPlus /> },
    { id: "q-1", x: 150, y: 80, label: "Cadastro", icon: <UserPlus /> },
    { id: "q0", x: 250, y: 150, label: "Login", icon: <User /> },
    { id: "q1", x: 400, y: 150, label: "User Check", icon: <User /> },
    { id: "q2", x: 550, y: 150, label: "Pass (1ª tentativa)", icon: <Key /> },
    { id: "q3", x: 550, y: 250, label: "Pass (2ª tentativa)", icon: <Key /> },
    { id: "q4", x: 550, y: 350, label: "Pass (3ª tentativa)", icon: <Key /> },
    { id: "q5", x: 700, y: 150, isFinal: true, label: "Acesso Concedido", icon: <Check /> },
    { id: "q6", x: 700, y: 350, label: "Conta Bloqueada", icon: <Lock /> },
  ];

  const dfaTransitions = [
    { from: "q-2", to: "q-1", symbol: "r", label: "Registrar novo usuário" },
    { from: "q-2", to: "q0", symbol: "l", label: "Ir para login" },
    { from: "q-1", to: "q0", symbol: "s", label: "Cadastro bem-sucedido" },
    { from: "q-1", to: "q-1", symbol: "f", label: "Falha na validação" },
    { from: "q0", to: "q1", symbol: "u", label: "Usuário existe" },
    { from: "q0", to: "q0", symbol: "n", label: "Usuário não existe" },
    { from: "q1", to: "q5", symbol: "c", label: "Senha correta" },
    { from: "q1", to: "q2", symbol: "i", label: "Senha incorreta" },
    { from: "q2", to: "q5", symbol: "c", label: "Senha correta" },
    { from: "q2", to: "q3", symbol: "i", label: "Senha incorreta" },
    { from: "q3", to: "q5", symbol: "c", label: "Senha correta" },
    { from: "q3", to: "q4", symbol: "i", label: "Senha incorreta" },
    { from: "q4", to: "q5", symbol: "c", label: "Senha correta" },
    { from: "q4", to: "q6", symbol: "i", label: "Senha incorreta (3 tentativas)" },
  ];

  // Versão NFA também incluindo cadastro
  const nfaStates = [
    { id: "q-2", x: 50, y: 150, isInitial: true, label: "Início", icon: <UserPlus /> },
    { id: "q-1", x: 150, y: 80, label: "Cadastro", icon: <UserPlus /> },
    { id: "q0", x: 250, y: 150, label: "Login", icon: <User /> },
    { id: "q1", x: 350, y: 150, label: "User Check", icon: <User /> },
    { id: "q2", x: 450, y: 100, label: "Pass (1ª tentativa)", icon: <Key /> },
    { id: "q3", x: 450, y: 200, label: "Pass (2ª tentativa)", icon: <Key /> },
    { id: "q4", x: 450, y: 300, label: "Pass (3ª tentativa)", icon: <Key /> },
    { id: "q5", x: 600, y: 150, label: "Escolha 2FA", icon: <Shield /> },
    { id: "q6", x: 750, y: 70, label: "SMS", icon: <Smartphone /> },
    { id: "q7", x: 750, y: 150, label: "Email", icon: <Info /> },
    { id: "q8", x: 750, y: 230, label: "App", icon: <Smartphone /> },
    { id: "q9", x: 900, y: 150, isFinal: true, label: "Acesso Concedido", icon: <Check /> },
    { id: "q10", x: 600, y: 300, label: "Conta Bloqueada", icon: <Lock /> },
  ];

  const nfaTransitions = [
    { from: "q-2", to: "q-1", symbol: "r", label: "Registrar novo usuário" },
    { from: "q-2", to: "q0", symbol: "l", label: "Ir para login" },
    { from: "q-1", to: "q0", symbol: "s", label: "Cadastro bem-sucedido" },
    { from: "q-1", to: "q-1", symbol: "f", label: "Falha na validação" },
    { from: "q0", to: "q1", symbol: "u", label: "Usuário existe" },
    { from: "q0", to: "q0", symbol: "n", label: "Usuário não existe" },
    { from: "q1", to: "q5", symbol: "c", label: "Senha correta (com 2FA)" },
    { from: "q1", to: "q9", symbol: "c", label: "Senha correta (sem 2FA)" },
    { from: "q1", to: "q2", symbol: "i", label: "Senha incorreta" },
    { from: "q2", to: "q5", symbol: "c", label: "Senha correta (com 2FA)" },
    { from: "q2", to: "q9", symbol: "c", label: "Senha correta (sem 2FA)" },
    { from: "q2", to: "q3", symbol: "i", label: "Senha incorreta" },
    { from: "q3", to: "q5", symbol: "c", label: "Senha correta (com 2FA)" },
    { from: "q3", to: "q9", symbol: "c", label: "Senha correta (sem 2FA)" },
    { from: "q3", to: "q4", symbol: "i", label: "Senha incorreta" },
    { from: "q4", to: "q5", symbol: "c", label: "Senha correta (com 2FA)" },
    { from: "q4", to: "q9", symbol: "c", label: "Senha correta (sem 2FA)" },
    { from: "q4", to: "q10", symbol: "i", label: "Senha incorreta (3 tentativas)" },
    { from: "q5", to: "q6", symbol: "s", label: "Escolheu SMS" },
    { from: "q5", to: "q7", symbol: "e", label: "Escolheu Email" },
    { from: "q5", to: "q8", symbol: "a", label: "Escolheu App" },
    { from: "q6", to: "q9", symbol: "v", label: "Código correto" },
    { from: "q6", to: "q6", symbol: "f", label: "Código incorreto" },
    { from: "q7", to: "q9", symbol: "v", label: "Código correto" },
    { from: "q7", to: "q7", symbol: "f", label: "Código incorreto" },
    { from: "q8", to: "q9", symbol: "v", label: "Código correto" },
    { from: "q8", to: "q8", symbol: "f", label: "Código incorreto" },
  ];

  const inputLabels = {
    u: "Usuário Existe",
    n: "Usuário Não Existe",
    c: "Senha Correta",
    i: "Senha Incorreta",
    s: "SMS 2FA / Cadastro OK",
    e: "Email 2FA",
    a: "App 2FA",
    v: "Código Correto",
    f: "Código/Cadastro Incorreto",
    r: "Registrar Usuário",
    l: "Ir para Login",
  };

  const [dfaCurrentState, setDfaCurrentState] = useState("q-2");
  const [nfaCurrentState, setNfaCurrentState] = useState("q-2");
  const [history, setHistory] = useState([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [autoMode, setAutoMode] = useState("manual");
  
  // Função para processar o cadastro
  const handleCadastro = () => {
    // Validações básicas
    if (!username || !password || !email) {
      setCadastroError("Todos os campos são obrigatórios");
      return;
    }
    
    if (password !== confirmPassword) {
      setCadastroError("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      setCadastroError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    // Simular cadastro bem-sucedido
    setCadastroSuccess(true);
    setCadastroError("");
    
    // Atualizar o estado do autômato (mover para o próximo estado após cadastro)
    handleInput("DFA", "s");
    handleInput("NFA", "s");
  };

  // Função para encontrar transições válidas a partir do estado atual
  const getAvailableInputs = (type, state) => {
    const transitions = type === "DFA" ? dfaTransitions : nfaTransitions;
    const validTransitions = transitions.filter(t => t.from === state);
    const uniqueInputs = Array.from(new Set(validTransitions.map(t => t.symbol)));
    return uniqueInputs;
  };

  // Função para processar uma entrada
  const handleInput = (type, input) => {
    const currentState = type === "DFA" ? dfaCurrentState : nfaCurrentState;
    const transitions = type === "DFA" ? dfaTransitions : nfaTransitions;
    
    // Encontrar a transição correspondente
    const transition = transitions.find(t => t.from === currentState && t.symbol === input);
    
    if (transition) {
      const newState = transition.to;
      
      // Atualizar o estado atual
      if (type === "DFA") {
        setDfaCurrentState(newState);
      } else {
        setNfaCurrentState(newState);
      }
      
      // Registrar no histórico
      setHistory(prev => [...prev, {
        type,
        from: currentState,
        to: newState,
        input,
        message: transition.label,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  // Função para resetar o simulador
  const resetSimulator = (type) => {
    if (type === "DFA" || type === "all") {
      setDfaCurrentState("q-2");
    }
    if (type === "NFA" || type === "all") {
      setNfaCurrentState("q-2");
    }
    if (type === "all") {
      setHistory([]);
      setCadastroSuccess(false);
      setCadastroError("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
    }
  };
  
  // Componente de visualização do autômato (mesmo código que você já tem)
  // Componente de visualização do autômato
// Componente de visualização do autômato
const AutomatonVisualizer = ({ states, transitions, currentState, type }) => {
  const stateRadius = 30;
  const width = 900;
  const height = 400;
  
  // Estados para controlar o deslocamento, zoom e interação
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: width, height: height });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Efeito para centralizar automaticamente o estado atual e aplicar zoom
  React.useEffect(() => {
    const activeState = states.find(s => s.id === currentState);
    if (activeState) {
      const targetX = activeState.x - (width / (2 * zoomLevel));
      const targetY = activeState.y - (height / (2 * zoomLevel));
      setViewBox(prev => ({
        ...prev,
        x: targetX,
        y: targetY,
        width: width / zoomLevel,
        height: height / zoomLevel
      }));
    }
  }, [currentState, states, width, height, zoomLevel]);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      <svg 
        width={width} 
        height={height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={(e) => {
          if (e.button === 0) { // Botão esquerdo do mouse
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseMove={(e) => {
          if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setViewBox(prev => ({
              ...prev,
              x: prev.x - dx * 0.5 / zoomLevel,
              y: prev.y - dy * 0.5 / zoomLevel
            }));
            setDragStart({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Linhas de transição */}
        {transitions.map((transition, index) => {
          const fromState = states.find(s => s.id === transition.from);
          const toState = states.find(s => s.id === transition.to);
          if (!fromState || !toState) return null;

          // Auto-transição (self-loop)
          if (transition.from === transition.to) {
            return (
              <g key={index}>
                <path
                  d={`M ${fromState.x + stateRadius} ${fromState.y} 
                      C ${fromState.x + 50} ${fromState.y - 50},
                        ${fromState.x + 50} ${fromState.y - 50},
                        ${fromState.x + stateRadius} ${fromState.y}`}
                  fill="none"
                  stroke={currentState === fromState.id && getAvailableInputs(type, currentState).includes(transition.symbol) ? "#6366f1" : "#CBD5E1"}
                  strokeWidth="2"
                  strokeDasharray={currentState === fromState.id && getAvailableInputs(type, currentState).includes(transition.symbol) ? "5,5" : "none"}
                />
                <text
                  x={fromState.x + 40}
                  y={fromState.y - 30}
                  textAnchor="middle"
                  fill="#64748B"
                  className="text-xs font-medium"
                >
                  {transition.symbol}
                </text>
              </g>
            );
          }

          // Transição normal (linha curva)
          const dx = toState.x - fromState.x;
          const dy = toState.y - fromState.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Para transições inversas, aumentar a curvatura
          const isSameStates = transitions.some(t => 
            t.from === transition.to && t.to === transition.from
          );
          
          // Ajustar curvatura com base na direção
          const curvature = isSameStates ? 0.3 : 0.1;
          const mx = (fromState.x + toState.x) / 2;
          const my = (fromState.y + toState.y) / 2;
          const cx = mx - dy * curvature;
          const cy = my + dx * curvature;

          return (
            <g key={index}>
              <path
                d={`M ${fromState.x} ${fromState.y} Q ${cx} ${cy} ${toState.x} ${toState.y}`}
                fill="none"
                stroke={currentState === fromState.id && getAvailableInputs(type, currentState).includes(transition.symbol) ? "#6366f1" : "#CBD5E1"}
                strokeWidth="2"
                strokeDasharray={currentState === fromState.id && getAvailableInputs(type, currentState).includes(transition.symbol) ? "5,5" : "none"}
              />
              <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                fill={currentState === fromState.id && getAvailableInputs(type, currentState).includes(transition.symbol) ? "#4f46e5" : "#64748B"}
                className="text-xs font-medium"
              >
                {transition.symbol}
              </text>
            </g>
          );
        })}

        {/* Estados */}
        {states.map((state) => {
          const isActive = currentState === state.id;
          const isFinal = state.isFinal;
          const isInitial = state.isInitial;
          
          return (
            <g key={state.id} className="cursor-pointer">
              {/* Estado inicial (seta) */}
              {isInitial && (
                <path
                  d={`M${state.x - 45},${state.y} L${state.x - stateRadius - 5},${state.y}`}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
              
              {/* Círculo do estado */}
              <circle
                cx={state.x}
                cy={state.y}
                r={stateRadius}
                fill={isActive ? "#818cf8" : "white"}
                stroke={isFinal ? "#4f46e5" : isActive ? "#4f46e5" : "#CBD5E1"}
                strokeWidth={isFinal || isActive ? "3" : "2"}
                onClick={() => console.log(`Clicou no estado ${state.id}`)}
              />
              
              {/* Círculo duplo para estados finais */}
              {isFinal && (
                <circle
                  cx={state.x}
                  cy={state.y}
                  r={stateRadius - 5}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
              )}
              
              {/* Ícone do estado */}
              <foreignObject
                x={state.x - 12}
                y={state.y - 12}
                width="24"
                height="24"
                className="pointer-events-none"
              >
                <div className="flex items-center justify-center text-sm">
                  {React.cloneElement(state.icon, { 
                    size: 16, 
                    className: isActive ? "text-white" : "text-gray-600" 
                  })}
                </div>
              </foreignObject>
              
              {/* Rótulo do estado */}
              <text
                x={state.x}
                y={state.y + stateRadius + 15}
                textAnchor="middle"
                fill={isActive ? "#4338ca" : "#1F2937"}
                className="text-xs font-medium pointer-events-none"
              >
                {state.label}
              </text>
              
              {/* ID do estado */}
              <text
                x={state.x}
                y={state.y + stateRadius + 30}
                textAnchor="middle"
                fill="#64748B"
                className="text-xs pointer-events-none"
              >
                {state.id}
              </text>
            </g>
          );
        })}
        
        {/* Definições para setas */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#94A3B8"
            />
          </marker>
        </defs>
      </svg>
      
      {/* Controles de zoom */}
      <div className="flex justify-end mt-2 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(prev => Math.max(prev * 0.8, 0.5))}
          className="h-8 w-8 p-0"
          title="Diminuir zoom"
        >
          <span className="text-lg">−</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(1)}
          className="h-8 px-2 text-xs"
          title="Resetar zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(prev => Math.min(prev * 1.2, 3))}
          className="h-8 w-8 p-0"
          title="Aumentar zoom"
        >
          <span className="text-lg">+</span>
        </Button>
      </div>
    </div>
  );
};

  // Componente para histórico de transições
  const TransitionHistory = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Histórico de Transições</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Sem transições registradas ainda. Interaja com os autômatos para ver o histórico.
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md text-sm">
                    <Badge variant="outline" className="mr-2">
                      {entry.type}
                    </Badge>
                    <div className="font-mono">
                      {entry.from} 
                      <span className="mx-2 text-gray-400">→</span> 
                      {entry.to}
                    </div>
                    <Badge className="mx-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      {entry.input}
                    </Badge>
                    <span className="text-gray-600 flex-1">{entry.message}</span>
                    <span className="text-gray-400 text-xs">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de formulário de cadastro
  const SignupForm = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cadastro de Usuário</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para simular o cadastro de um novo usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleCadastro}>
                Cadastrar
              </Button>
            </div>
            
            {cadastroError && (
              <Alert className="bg-red-50 border-red-100">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700">Erro no cadastro</AlertTitle>
                <AlertDescription className="text-red-600">
                  {cadastroError}
                </AlertDescription>
              </Alert>
            )}
            
            {cadastroSuccess && (
              <Alert className="bg-green-50 border-green-100">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700">Cadastro realizado com sucesso!</AlertTitle>
                <AlertDescription className="text-green-600">
                  Você pode agora prosseguir para o login. O autômato avançou para o próximo estado.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Simulador de Sistemas de Autenticação</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore como os autômatos finitos modelam a lógica completa de sistemas de autenticação, incluindo cadastro,
            login e verificação em duas etapas.
          </p>
        </div>

        {showExplanation && (
          <Alert className="bg-indigo-50 border-indigo-100">
            <AlertCircle className="h-4 w-4 text-indigo-600" />
            <AlertTitle className="text-indigo-700">Autômatos em Sistemas de Autenticação</AlertTitle>
            <AlertDescription className="text-indigo-600">
              Este simulador demonstra como autômatos finitos podem modelar sistemas de autenticação completos,
              desde o cadastro de usuários até o login com verificação em duas etapas (2FA).
              Você pode interagir com as visualizações para entender como cada etapa funciona.
            </AlertDescription>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowExplanation(false)}>
              Entendi
            </Button>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="text-indigo-600" size={20} />
                Autômato Finito Determinístico (AFD)
              </CardTitle>
              <CardDescription>
                Um AFD tem exatamente uma transição para cada entrada em cada estado. 
                Este modelo representa o fluxo completo desde o cadastro até a autenticação básica.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-indigo-600" size={20} />
                Autômato Finito Não-Determinístico (AFN)
              </CardTitle>
              <CardDescription>
                Um AFN pode ter múltiplas transições para uma entrada em um estado. 
                Este modelo
                Um AFN pode ter múltiplas transições para uma entrada em um estado. 
                Este modelo representa um sistema completo com cadastro, login e opções de verificação em duas etapas.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline" 
              onClick={() => resetSimulator('all')}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reiniciar Simulação
            </Button>
            
            {/* Controles de modo de simulação */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Modo:</span>
              <select
                value={autoMode}
                onChange={(e) => setAutoMode(e.target.value)}
                className="text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="manual">Manual</option>
                <option value="guided">Guiado</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={showExplanation ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setShowExplanation(!showExplanation)}>
              Explicações
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="signup" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
            <TabsTrigger value="side-by-side">Simulador Lado a Lado</TabsTrigger>
            <TabsTrigger value="dfa">Apenas AFD</TabsTrigger>
            <TabsTrigger value="nfa">Apenas AFN</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            <SignupForm />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visualização AFD no modo de cadastro */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="outline">AFD</Badge> Fluxo de Cadastro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Observe como o estado inicial do autômato começa em "Início", permitindo escolher entre
                    o caminho de cadastro ou ir diretamente para o login. Após um cadastro bem-sucedido,
                    o fluxo segue para o estado de login.
                  </p>
                  
                  <AutomatonVisualizer
                    states={dfaStates.filter(s => ['q-2', 'q-1', 'q0'].includes(s.id))}
                    transitions={dfaTransitions.filter(t => ['q-2', 'q-1', 'q0'].includes(t.from))}
                    currentState={dfaCurrentState}
                    type="DFA"
                  />
                  
                  <div className="p-4 bg-gray-50 rounded-lg mt-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="text-indigo-600">Estado Atual: </span>
                      <Badge variant="secondary" className="font-mono">{dfaCurrentState}</Badge>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getAvailableInputs("DFA", dfaCurrentState).map((input) => (
                        <Button
                          key={input}
                          variant="outline"
                          size="sm"
                          onClick={() => handleInput("DFA", input)}
                          className="min-w-[100px]"
                        >
                          {inputLabels[input]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Instruções de uso */}
              <Card>
                <CardHeader>
                  <CardTitle>Como funciona o cadastro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">Passo 1: Iniciando o fluxo</h3>
                      <p className="text-sm text-gray-600">
                        No estado inicial (q-2), você pode escolher entre "Registrar Usuário" ou "Ir para Login".
                        Selecione "Registrar Usuário" para iniciar o processo de cadastro.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">Passo 2: Formulário de cadastro</h3>
                      <p className="text-sm text-gray-600">
                        Preencha o formulário com suas informações. O sistema validará os dados
                        e mostrará mensagens de erro caso necessário.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-indigo-700">Passo 3: Transição para login</h3>
                      <p className="text-sm text-gray-600">
                        Após o cadastro bem-sucedido, o autômato transitará automaticamente
                        para o estado de Login (q0), completando o fluxo inicial.
                      </p>
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-100">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-700">Regras de validação no cadastro</AlertTitle>
                      <AlertDescription className="text-blue-600">
                        O sistema verifica se todos os campos estão preenchidos, se as senhas coincidem
                        e se a senha tem pelo menos 6 caracteres. Essas validações são importantes para
                        garantir a segurança do sistema.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="side-by-side">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visualização AFD */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="outline">AFD</Badge> Autenticação Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AutomatonVisualizer
                    states={dfaStates}
                    transitions={dfaTransitions}
                    currentState={dfaCurrentState}
                    type="DFA"
                  />
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="text-indigo-600">Estado Atual: </span>
                      <Badge variant="secondary" className="font-mono">{dfaCurrentState}</Badge>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getAvailableInputs("DFA", dfaCurrentState).map((input) => (
                        <Button
                          key={input}
                          variant="outline"
                          size="sm"
                          onClick={() => handleInput("DFA", input)}
                          className="min-w-[100px]"
                        >
                          {inputLabels[input]}
                        </Button>
                      ))}
                      
                      {getAvailableInputs("DFA", dfaCurrentState).length === 0 && (
                        <div className="text-sm text-gray-500 py-1">
                          Estado terminal alcançado. 
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => resetSimulator('DFA')}
                          >
                            Reiniciar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Visualização AFN */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="outline">AFN</Badge> Autenticação com 2FA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AutomatonVisualizer
                    states={nfaStates}
                    transitions={nfaTransitions}
                    currentState={nfaCurrentState}
                    type="NFA"
                  />
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="text-indigo-600">Estado Atual: </span>
                      <Badge variant="secondary" className="font-mono">{nfaCurrentState}</Badge>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getAvailableInputs("NFA", nfaCurrentState).map((input) => (
                        <Button
                          key={input}
                          variant="outline"
                          size="sm"
                          onClick={() => handleInput("NFA", input)}
                          className="min-w-[100px]"
                        >
                          {inputLabels[input]}
                        </Button>
                      ))}
                      
                      {getAvailableInputs("NFA", nfaCurrentState).length === 0 && (
                        <div className="text-sm text-gray-500 py-1">
                          Estado terminal alcançado. 
                          <Button 
                            variant="link" 
                            size="sm"
                            onClick={() => resetSimulator('NFA')}
                          >
                            Reiniciar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="dfa">
            <Card>
              <CardHeader>
                <CardTitle>Autenticação Básica (AFD)</CardTitle>
                <CardDescription>
                  Um modelo determinístico que representa o fluxo completo desde o cadastro até a autenticação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AutomatonVisualizer
                  states={dfaStates}
                  transitions={dfaTransitions}
                  currentState={dfaCurrentState}
                  type="DFA"
                />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <span className="text-indigo-600">Estado Atual: </span>
                    <Badge variant="secondary" className="font-mono">{dfaCurrentState}</Badge>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getAvailableInputs("DFA", dfaCurrentState).map((input) => (
                      <Button
                        key={input}
                        variant="outline"
                        size="sm"
                        onClick={() => handleInput("DFA", input)}
                        className="min-w-[100px]"
                      >
                        {inputLabels[input]}
                      </Button>
                    ))}
                    
                    {getAvailableInputs("DFA", dfaCurrentState).length === 0 && (
                      <div className="text-sm text-gray-500 py-1">
                        Estado terminal alcançado. 
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => resetSimulator('DFA')}
                        >
                          Reiniciar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {dfaCurrentState === "q5" && (
                  <Alert className="bg-green-50 border-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">Autenticação bem-sucedida</AlertTitle>
                    <AlertDescription className="text-green-600">
                      O usuário forneceu credenciais válidas e obteve acesso ao sistema.
                    </AlertDescription>
                  </Alert>
                )}
                
                {dfaCurrentState === "q6" && (
                  <Alert className="bg-red-50 border-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-700">Conta bloqueada</AlertTitle>
                    <AlertDescription className="text-red-600">
                      Após 3 tentativas de senha incorreta, a conta foi bloqueada temporariamente como medida de segurança.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nfa">
            <Card>
              <CardHeader>
                <CardTitle>Autenticação com 2FA (AFN)</CardTitle>
                <CardDescription>
                  Um modelo não-determinístico que representa um sistema completo com cadastro,
                  login e múltiplas opções de verificação em duas etapas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AutomatonVisualizer
                  states={nfaStates}
                  transitions={nfaTransitions}
                  currentState={nfaCurrentState}
                  type="NFA"
                />
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <span className="text-indigo-600">Estado Atual: </span>
                    <Badge variant="secondary" className="font-mono">{nfaCurrentState}</Badge>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getAvailableInputs("NFA", nfaCurrentState).map((input) => (
                      <Button
                        key={input}
                        variant="outline"
                        size="sm"
                        onClick={() => handleInput("NFA", input)}
                        className="min-w-[100px]"
                      >
                        {inputLabels[input]}
                      </Button>
                    ))}
                    
                    {getAvailableInputs("NFA", nfaCurrentState).length === 0 && (
                      <div className="text-sm text-gray-500 py-1">
                        Estado terminal alcançado. 
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => resetSimulator('NFA')}
                        >
                          Reiniciar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {nfaCurrentState === "q9" && (
                  <Alert className="bg-green-50 border-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">Autenticação bem-sucedida</AlertTitle>
                    <AlertDescription className="text-green-600">
                      O usuário forneceu credenciais válidas e passou pela verificação de dois fatores (2FA).
                    </AlertDescription>
                  </Alert>
                )}
                
                {nfaCurrentState === "q10" && (
                  <Alert className="bg-red-50 border-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-700">Conta bloqueada</AlertTitle>
                    <AlertDescription className="text-red-600">
                      Após 3 tentativas de senha incorreta, a conta foi bloqueada temporariamente como medida de segurança.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Histórico de transições */}
        <TransitionHistory />

        {/* Comparação de AFD vs AFN */}
        {showExplanation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Fluxo Completo de Autenticação com Autômatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Em sistemas reais de autenticação, o fluxo completo envolve três etapas principais:
                  cadastro, login e, opcionalmente, verificação em duas etapas.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-md font-medium text-blue-700 mb-2">1. Cadastro</h3>
                    <ul className="space-y-1 text-sm text-blue-600 list-disc pl-5">
                      <li>Coleta de informações do usuário</li>
                      <li>Validação dos dados fornecidos</li>
                      <li>Armazenamento seguro (hash de senha)</li>
                      <li>Confirmação por email (opcional)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-md font-medium text-indigo-700 mb-2">2. Login</h3>
                    <ul className="space-y-1 text-sm text-indigo-600 list-disc pl-5">
                      <li>Verificação do nome de usuário</li>
                      <li>Validação da senha (até 3 tentativas)</li>
                      <li>Geração de tokens de sessão</li>
                      <li>Proteção contra força bruta</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-md font-medium text-purple-700 mb-2">3. Verificação 2FA</h3>
                    <ul className="space-y-1 text-sm text-purple-600 list-disc pl-5">
                      <li>Escolha do método (SMS, email, app)</li>
                      <li>Geração de código temporário</li>
                      <li>Validação do código informado</li>
                      <li>Armazenamento de dispositivos confiáveis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Benefícios de modelar com autômatos</h3>
                  <p className="text-sm text-gray-600">
                    Modelar sistemas de autenticação usando autômatos finitos traz benefícios como:
                    visualização clara dos fluxos possíveis, identificação de brechas de segurança, 
                    facilidade na implementação de novos caminhos (como recuperação de senha) e
                    validação formal do comportamento esperado do sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthSimulator;