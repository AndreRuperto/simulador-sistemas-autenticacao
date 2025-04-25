import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Check, 
  Info, 
  Key, 
  Lock, 
  Mail, 
  Shield, 
  Smartphone, 
  User, 
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight
} from 'lucide-react';

// Importação dos componentes do shadcn-ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Interface para as props do componente
interface AuthUserExperienceProps {
  onStateChange?: (state: string) => void;
  currentState?: string;
  showControls?: boolean;
}

const AuthUserExperience: React.FC<AuthUserExperienceProps> = ({ 
  onStateChange, 
  currentState = "q-2",
  showControls = true
}) => {
  // Estados do componente
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [method2FA, setMethod2FA] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeState, setActiveState] = useState(currentState);
  const [automatonMode, setAutomatonMode] = useState<'DFA' | 'NFA'>('DFA');
  const [use2FA, setUse2FA] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([
    { username: "admin", password: "admin123", email: "admin@example.com", twoFAEnabled: true }
  ]);
  const [currentUser, setCurrentUser] = useState<{username: string, password: string, email: string, twoFAEnabled: boolean} | null>(null);
  
  // Sincronizar o estado interno com props externas
  useEffect(() => {
    setActiveState(currentState);
  }, [currentState]);

  // Notificar o componente pai sobre mudanças de estado
  const updateState = (newState: string) => {
    setActiveState(newState);
    if (onStateChange) {
      onStateChange(newState);
    }
  };
  
  // Definição dos estados do autômato
  const states = {
    "q-2": { label: "Início", icon: <User />, description: "Estado inicial do sistema" },
    "q-1": { label: "Cadastro", icon: <UserPlus />, description: "Processo de registro de novo usuário" },
    "q0": { label: "Login", icon: <LogIn />, description: "Tela de login para usuários cadastrados" },
    "q1": { label: "Verificação de Usuário", icon: <User />, description: "Verificando se o usuário existe" },
    "q2": { label: "Senha (1ª tentativa)", icon: <Key />, description: "Primeira tentativa de senha" },
    "q3": { label: "Senha (2ª tentativa)", icon: <Key />, description: "Segunda tentativa de senha" },
    "q4": { label: "Senha (3ª tentativa)", icon: <Key />, description: "Terceira tentativa de senha" },
    "q5": { label: "Escolha 2FA", icon: <Shield />, description: "Escolha do método de autenticação de dois fatores" },
    "q6": { label: "2FA SMS", icon: <Smartphone />, description: "Verificação por SMS" },
    "q7": { label: "2FA Email", icon: <Mail />, description: "Verificação por email" },
    "q8": { label: "2FA App", icon: <Smartphone />, description: "Verificação por aplicativo" },
    "q9": { label: "Acesso Concedido", icon: <Check />, description: "Autenticação bem-sucedida", isFinal: true },
    "q10": { label: "Conta Bloqueada", icon: <Lock />, description: "Conta bloqueada após múltiplas tentativas", isFinal: true }
  };

  // Transições possíveis a partir de cada estado
const getAvailableTransitions = (state: string) => {
    // Definir transições diferentes para cada modo
    const dfaTransitions: Record<string, Array<{to: string, action: string, label: string}>> = {
      "q-2": [
        { to: "q-1", action: "register", label: "Criar conta" },
        { to: "q0", action: "login", label: "Fazer login" }
      ],
      "q-1": [
        { to: "q0", action: "register_success", label: "Cadastro bem-sucedido" },
        { to: "q-1", action: "register_fail", label: "Falha no cadastro" }
      ],
      "q0": [
        { to: "q1", action: "check_user", label: "Verificar usuário" }
      ],
      "q1": [
        { to: "q2", action: "user_exists", label: "Usuário existe" },
        { to: "q0", action: "user_not_found", label: "Usuário não encontrado" }
      ],
      "q2": [
        { to: "q9", action: "correct_password", label: "Senha correta → Acesso Concedido" },
        { to: "q3", action: "wrong_password", label: "Senha incorreta → Senha (2ª tentativa)" }
      ],
      "q3": [
        { to: "q9", action: "correct_password", label: "Senha correta → Acesso Concedido" },
        { to: "q4", action: "wrong_password", label: "Senha incorreta → Senha (3ª tentativa)" }
      ],
      "q4": [
        { to: "q9", action: "correct_password", label: "Senha correta → Acesso Concedido" },
        { to: "q10", action: "wrong_password", label: "Senha incorreta → Conta Bloqueada" }
      ],
      "q9": [
        { to: "q-2", action: "logout", label: "Sair" }
      ],
      "q10": [
        { to: "q-2", action: "reset", label: "Resetar" }
      ]
    };
    
    const nfaTransitions: Record<string, Array<{to: string, action: string, label: string}>> = {
      "q-2": [
        { to: "q-1", action: "register", label: "Criar conta" },
        { to: "q0", action: "login", label: "Fazer login" }
      ],
      "q-1": [
        { to: "q0", action: "register_success", label: "Cadastro bem-sucedido" },
        { to: "q-1", action: "register_fail", label: "Falha no cadastro" }
      ],
      "q0": [
        { to: "q1", action: "check_user", label: "Verificar usuário" }
      ],
      "q1": [
        { to: "q2", action: "user_exists", label: "Usuário existe" },
        { to: "q0", action: "user_not_found", label: "Usuário não encontrado" }
      ],
      "q2": [
        { to: "q5", action: "correct_password", label: "Senha correta → Escolha 2FA" },
        { to: "q3", action: "wrong_password", label: "Senha incorreta → Senha (2ª tentativa)" }
      ],
      "q3": [
        { to: "q5", action: "correct_password", label: "Senha correta (com 2FA) → Escolha 2FA" },
        { to: "q9", action: "correct_password_no2fa", label: "Senha correta (sem 2FA) → Acesso Concedido" },
        { to: "q4", action: "wrong_password", label: "Senha incorreta → Senha (3ª tentativa)" }
      ],
      "q4": [
        { to: "q5", action: "correct_password", label: "Senha correta (com 2FA) → Escolha 2FA" },
        { to: "q9", action: "correct_password_no2fa", label: "Senha correta (sem 2FA) → Acesso Concedido" },
        { to: "q10", action: "wrong_password", label: "Senha incorreta → Conta Bloqueada" }
      ],
      "q5": [
        { to: "q6", action: "choose_sms", label: "Escolher SMS → 2FA SMS" },
        { to: "q7", action: "choose_email", label: "Escolher Email → 2FA Email" },
        { to: "q8", action: "choose_app", label: "Escolher App → 2FA App" }
      ],
      "q6": [
        { to: "q9", action: "valid_code", label: "Código válido → Acesso Concedido" },
        { to: "q6", action: "invalid_code", label: "Código inválido" }
      ],
      "q7": [
        { to: "q9", action: "valid_code", label: "Código válido → Acesso Concedido" },
        { to: "q7", action: "invalid_code", label: "Código inválido" }
      ],
      "q8": [
        { to: "q9", action: "valid_code", label: "Código válido → Acesso Concedido" },
        { to: "q8", action: "invalid_code", label: "Código inválido" }
      ],
      "q9": [
        { to: "q-2", action: "logout", label: "Sair" }
      ],
      "q10": [
        { to: "q-2", action: "reset", label: "Resetar" }
      ]
    };
    
    // Retornar as transições com base no modo selecionado
    return automatonMode === "DFA" ? (dfaTransitions[state] || []) : (nfaTransitions[state] || []);
  };

  // Manipuladores de ações do usuário
  const handleRegister = () => {
    // Validação
    const newErrors: Record<string, string> = {};
    if (!username) newErrors.username = "Nome de usuário é obrigatório";
    if (!email) newErrors.email = "Email é obrigatório";
    if (!password) newErrors.password = "Senha é obrigatória";
    if (password !== confirmPassword) newErrors.confirmPassword = "As senhas não coincidem";
    if (password && password.length < 6) newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    if (registeredUsers.some(u => u.username === username)) newErrors.username = "Este nome de usuário já existe";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Cadastro bem-sucedido
      setRegisteredUsers(prev => [...prev, { 
        username, 
        password, 
        email,
        twoFAEnabled: automatonMode === 'NFA' && use2FA
      }]);
      
      setSuccess("Usuário cadastrado com sucesso!");
      updateState("q0");
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: automatonMode === 'NFA' && use2FA
          ? "Você já pode fazer login com suas credenciais (2FA habilitado)" 
          : "Você já pode fazer login com suas credenciais",
        variant: "default",
      });
      
      // Limpar formulário
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } else {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
    }
  };
  
  const handleCheckUser = () => {
    const user = registeredUsers.find(u => u.username === username);
    
    if (user) {
      setCurrentUser(user);
      setErrors({});
      updateState("q2");
      
      toast({
        title: "Usuário encontrado",
        description: "Por favor, digite sua senha",
        variant: "default",
      });
    } else {
      setErrors({ username: "Usuário não encontrado" });
      
      toast({
        title: "Erro de login",
        description: "Usuário não encontrado",
        variant: "destructive",
      });
    }
  };
  
  const handleCheckPassword = () => {
    if (currentUser && password === currentUser.password) {
      setErrors({});
      
      if (automatonMode === "NFA" && currentUser.twoFAEnabled) {
        // Caminho NFN - Com verificação em duas etapas
        updateState("q5");
        
        toast({
          title: "Senha correta",
          description: "Por favor, complete a verificação em duas etapas",
          variant: "default",
        });
      } else {
        // Caminho AFD - Sem verificação em duas etapas
        updateState("q9");
        
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso",
          variant: "default",
        });
      }
    } else {
      setLoginAttempts(prev => prev + 1);
      setErrors({ password: "Senha incorreta" });
      
      if (loginAttempts >= 2) {
        // Terceira tentativa incorreta
        updateState("q10");
        
        toast({
          title: "Conta bloqueada",
          description: "Múltiplas tentativas incorretas de senha",
          variant: "destructive",
        });
      } else {
        if (loginAttempts === 0) {
          updateState("q3");
        } else {
          updateState("q4");
        }
        
        toast({
          title: "Senha incorreta",
          description: `Tentativa ${loginAttempts + 1} de 3`,
          variant: "destructive",
        });
      }
    }
  };
  
  const handleChoose2FAMethod = (method: string) => {
    setMethod2FA(method);
    
    if (method === "sms") {
      updateState("q6");
    } else if (method === "email") {
      updateState("q7");
    } else if (method === "app") {
      updateState("q8");
    }
    
    toast({
      title: `Verificação por ${method.toUpperCase()}`,
      description: "Um código foi enviado para sua verificação",
      variant: "default",
    });
  };
  
  const handleVerify2FA = () => {
    // Simulação simples: código "123456" é válido
    if (code2FA === "123456") {
      setErrors({});
      updateState("q9");
      
      toast({
        title: "Autenticação concluída",
        description: "Código verificado com sucesso",
        variant: "default",
      });
    } else {
      setErrors({ code: "Código inválido" });
      
      toast({
        title: "Código inválido",
        description: "Por favor, verifique e tente novamente",
        variant: "destructive",
      });
    }
  };
  
  const resetSimulator = () => {
    updateState("q-2");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setCode2FA("");
    setMethod2FA("");
    setLoginAttempts(0);
    setErrors({});
    setSuccess(null);
    setCurrentUser(null);
    // Não resetamos o automatonMode para manter a escolha do usuário
    
    toast({
      title: "Simulador reiniciado",
      description: "Todos os dados foram limpos",
      variant: "default",
    });
  };
  
  // Renderização condicional com base no estado atual
  const renderContent = () => {
    switch(activeState) {
      case "q-2": // Estado inicial
        return (
          <div className="flex flex-col items-center gap-6 my-8">
            <h2 className="text-2xl font-bold">Bem-vindo ao Sistema de Autenticação</h2>
            <p className="text-center max-w-md text-gray-600">
              Esta simulação demonstra a experiência de usuário em um sistema de autenticação completo.
            </p>
            
            {/* Seleção de modo de autômato */}
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 w-full max-w-md">
              <h3 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
                <Shield size={18} />
                Selecione o modo de autenticação:
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Button 
                  variant={automatonMode === "DFA" ? "default" : "outline"}
                  className="flex-col h-auto py-6"
                  onClick={() => setAutomatonMode("DFA")}
                >
                  <div className="font-medium">Básico (AFD)</div>
                  <p className="font-normal text-xs mt-2 px-4">
                    Autenticação simples <br></br>com usuário e senha
                  </p>
                </Button>
                
                <Button 
                  variant={automatonMode === "NFA" ? "default" : "outline"}
                  className="flex-col h-auto py-6"
                  onClick={() => setAutomatonMode("NFA")}
                >
                  <div className="font-medium">Avançado (AFN)</div>
                  <p className="font-normal text-xs mt-2 px-4">
                    Inclui verificação em <br></br>duas etapas (2FA)
                  </p>
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button 
                onClick={() => updateState("q-1")} 
                variant="outline"
                className="w-40"
              >
                <UserPlus size={18} />
                Criar Conta
              </Button>
              <Button 
                onClick={() => updateState("q0")} 
                className="w-40"
              >
                <LogIn size={18} />
                Fazer Login
              </Button>
            </div>
          </div>
        );
        
      case "q-1": // Cadastro
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>
                {automatonMode === "NFA" 
                  ? "Preencha seus dados para se cadastrar (com 2FA)" 
                  : "Preencha seus dados para se cadastrar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nome de usuário</label>
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Seu nome de usuário"
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Confirmar Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                {automatonMode === "NFA" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label htmlFor="use2fa" className="text-sm font-medium">
                          Ativar verificação em duas etapas (2FA)
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Recomendado para maior segurança da sua conta
                        </p>
                      </div>
                      <Switch 
                        id="use2fa" 
                        checked={use2FA}
                        onCheckedChange={setUse2FA}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => updateState("q-2")}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleRegister}
                  >
                    Cadastrar
                  </Button>
                </div>
              </div>
              
              {success && (
                <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>Cadastro realizado!</AlertTitle>
                  <AlertDescription>Você já pode fazer login.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );
        
      case "q0": // Login
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Fazer Login</CardTitle>
              <CardDescription>Entre com suas credenciais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nome de usuário</label>
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Seu nome de usuário"
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                    )}
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Usuários disponíveis para teste</AlertTitle>
                  <AlertDescription>
                    <p>Usuário: <span className="font-mono">admin</span>, Senha: <span className="font-mono">admin123</span> (com 2FA)</p>
                    {registeredUsers.filter(u => u.username !== "admin").length > 0 && (
                      <p className="mt-1">Você também pode usar uma conta que acabou de criar.</p>
                    )}
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => updateState("q-2")}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleCheckUser}
                    disabled={!username}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "q2": // Senha (1ª tentativa)
      case "q3": // Senha (2ª tentativa)
      case "q4": // Senha (3ª tentativa)
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Digite sua senha</CardTitle>
              <CardDescription>Olá, {currentUser?.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>
                
                {loginAttempts > 0 && (
                  <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle>Atenção!</AlertTitle>
                    <AlertDescription>
                      Tentativa {loginAttempts + 1} de 3. Após 3 tentativas incorretas, sua conta será bloqueada.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentUser(null);
                      updateState("q0");
                    }}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleCheckPassword}
                    disabled={!password}
                  >
                    Entrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "q5": // Escolha 2FA
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Verificação em duas etapas</CardTitle>
              <CardDescription>Escolha como deseja receber o código de verificação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-indigo-50 border-indigo-200 text-indigo-800">
                  <Info className="h-4 w-4 text-indigo-600" />
                  <AlertTitle>Autenticação em Duas Etapas (2FA)</AlertTitle>
                  <AlertDescription>
                    Este é um passo exclusivo do modo Avançado (AFN). No modo AFD, você seria 
                    autenticado diretamente após informar a senha correta.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start h-16"
                    onClick={() => handleChoose2FAMethod("sms")}
                  >
                    <Smartphone size={20} className="mr-2 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium">SMS</p>
                      <p className="text-xs text-gray-500">Código enviado por mensagem de texto</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start h-16"
                    onClick={() => handleChoose2FAMethod("email")}
                  >
                    <Mail size={20} className="mr-2 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-gray-500">Código enviado para seu email</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start h-16"
                    onClick={() => handleChoose2FAMethod("app")}
                  >
                    <Shield size={20} className="mr-2 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium">Aplicativo Autenticador</p>
                      <p className="text-xs text-gray-500">Use um app como Google Authenticator</p>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "q6": // 2FA SMS
      case "q7": // 2FA Email
      case "q8": // 2FA App
        {
          const methodLabel = {
            "q6": "SMS",
            "q7": "Email",
            "q8": "Aplicativo Autenticador"
          };
        
          const methodIcon = {
            "q6": <Smartphone size={20} className="text-indigo-600" />,
            "q7": <Mail size={20} className="text-indigo-600" />,
            "q8": <Shield size={20} className="text-indigo-600" />
          };
        
          return (
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {methodIcon[activeState as keyof typeof methodIcon]}
                  <CardTitle>Verificação por {methodLabel[activeState as keyof typeof methodLabel]}</CardTitle>
                </div>
                <CardDescription>
                  {activeState === "q6" && "Um código foi enviado para seu telefone"}
                  {activeState === "q7" && "Um código foi enviado para seu email"}
                  {activeState === "q8" && "Use seu aplicativo autenticador para gerar um código"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Código de demonstração</AlertTitle>
                    <AlertDescription>
                      Para fins de demonstração, o código correto é: <span className="font-mono font-bold">123456</span>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Código de verificação</label>
                    <div className="relative">
                      <Input
                        value={code2FA}
                        onChange={(e) => setCode2FA(e.target.value)}
                        placeholder="Digite o código"
                        className={`text-center font-mono text-lg tracking-widest ${errors.code ? "border-red-500" : ""}`}
                        maxLength={6}
                      />
                    {errors.code && (
                      <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => updateState("q5")}
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleVerify2FA}
                    disabled={code2FA.length < 6}
                  >
                    Verificar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
        
      case "q9": // Acesso Concedido
        return (
          <Card className="mt-4 bg-green-50 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Check size={20} className="text-green-600" />
                <CardTitle className="text-green-800">Acesso Concedido</CardTitle>
              </div>
              <CardDescription className="text-green-700">
                Autenticação concluída com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={40} className="text-green-600" />
                  </div>
                </div>
                
                <div className="text-center text-green-700">
                  <h3 className="font-medium text-lg">Olá, {currentUser?.username}!</h3>
                  <p className="mt-1">Você foi autenticado com sucesso.</p>
                  
                  {automatonMode === "NFA" && (
                    <p className="mt-3 text-sm">
                      Autenticação de dois fatores concluída através de {method2FA === "sms" ? "SMS" : method2FA === "email" ? "Email" : "Aplicativo"}
                    </p>
                  )}
                </div>
                
                <Alert className="bg-green-100 border-green-300 text-green-800">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle>Estado Final Alcançado</AlertTitle>
                  <AlertDescription>
                    Este é um estado final do autômato, representando a conclusão do fluxo de autenticação.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={resetSimulator}
                    className="w-full"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reiniciar Simulação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "q10": // Conta Bloqueada
        return (
          <Card className="mt-4 bg-red-50 border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-red-600" />
                <CardTitle className="text-red-800">Conta Bloqueada</CardTitle>
              </div>
              <CardDescription className="text-red-700">
                Múltiplas tentativas incorretas de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                    <Lock size={40} className="text-red-600" />
                  </div>
                </div>
                
                <div className="text-center text-red-700">
                  <h3 className="font-medium text-lg">Sua conta foi bloqueada</h3>
                  <p className="mt-1">Por questões de segurança, sua conta foi temporariamente bloqueada devido a múltiplas tentativas incorretas de senha.</p>
                </div>
                
                <Alert className="bg-red-100 border-red-300 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle>Estado Final Alcançado</AlertTitle>
                  <AlertDescription>
                    Este é um estado final negativo do autômato, indicando falha no processo de autenticação.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={resetSimulator}
                    variant="destructive"
                    className="w-full"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Reiniciar Simulação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <div className="p-4 text-center">
            <p>Estado desconhecido: {activeState}</p>
            <Button className="mt-4" onClick={resetSimulator}>Resetar</Button>
          </div>
        );
    }
  };
  
  // Componente principal de visualização do estado atual do autômato
  const renderStateIndicator = () => {
    if (!showControls) return null;
    
    return (
      <div className="w-full bg-slate-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="font-mono text-xs px-5 py-1 bg-slate-100"
            >
              {states[activeState as keyof typeof states]?.label || activeState}
            </Badge>
            
            <ArrowRight size={14} className="text-slate-400" />
            
            <span className="text-sm text-slate-600">
              {states[activeState as keyof typeof states]?.description || "Estado atual do autômato"}
            </span>
          </div>
          
          <Badge 
            variant={automatonMode === "DFA" ? "secondary" : "default"}
          >
            Modo {automatonMode === "DFA" ? "Básico (AFD)" : "Avançado (AFN)"}
          </Badge>
        </div>
        
        {/* Transições disponíveis */}
        {showControls && (
        <div className="mt-4">
            <h3 className="text-xs font-medium text-slate-500 mb-2">Transições disponíveis:</h3>
            <div className="flex flex-col gap-2">
            {getAvailableTransitions(activeState).map((transition, index) => (
                <Badge 
                key={index}
                variant="outline"
                className="text-xs bg-slate-100 py-1 text-left"
                >
                {transition.label}
                </Badge>
            ))}
            
            {getAvailableTransitions(activeState).length === 0 && (
                <span className="text-xs text-slate-500">
                Nenhuma transição disponível (estado final)
                </span>
            )}
            </div>
        </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto">
      {renderStateIndicator()}
      {renderContent()}
    </div>
  );
};

export default AuthUserExperience;