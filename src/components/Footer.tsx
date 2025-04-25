import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Info, Users } from 'lucide-react';

// Componente para o rodapé com informações da equipe
const Footer = () => {
  const [showTeam, setShowTeam] = useState(false);
  
  return (
    <div className="mt-12 py-4 border-t border-gray-200 text-center">
      <h4 className="text-base font-medium text-indigo-700 mb-4">
        Trabalho Acadêmico da disciplina Linguagens Formais e Autômatos - 2025
      </h4>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowTeam(!showTeam)}
        className="mb-4"
      >
        <Users className="mr-2 h-4 w-4" />
        {showTeam ? "Ocultar Equipe" : "Ver Equipe"}
      </Button>
      
      {showTeam && (
        <div className="animate-in fade-in-50 duration-300">
          <h3 className="text-lg font-medium mb-3">Equipe de Desenvolvimento</h3>
          <div className="flex flex-col items-center space-y-2 text-sm text-gray-600">
            <div>Julio Augusto Rodrigues Lopes - 30132401</div>
            <div>José Henrique da Silva Mata - 30525187</div>
            <div>Miguel de Moraes Bastos - 30129061</div>
            <div>André Ruperto de Macêdo - 30003032</div>
            <div>Gabriel Oliveira Faria - (RGM a definir)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;