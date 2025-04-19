
import React from 'react';
import AuthVisualizer from '@/components/AuthVisualizer';
import AuthControls from '@/components/AuthControls';
import { Card } from "@/components/ui/card";

// DFA States for Authentication
const dfaStates = [
  { id: "q0", x: 100, y: 150, isInitial: true, label: "Login" },
  { id: "q1", x: 200, y: 150, label: "User Check" },
  { id: "q2", x: 300, y: 150, label: "Pass (1st)" },
  { id: "q3", x: 400, y: 150, label: "Pass (2nd)" },
  { id: "q4", x: 500, y: 150, label: "Pass (3rd)" },
  { id: "q5", x: 300, y: 250, isFinal: true, label: "Access" },
  { id: "q6", x: 500, y: 250, label: "Blocked" },
];

const dfaTransitions = [
  { from: "q0", to: "q1", symbol: "u" },
  { from: "q0", to: "q0", symbol: "n" },
  { from: "q1", to: "q5", symbol: "c" },
  { from: "q1", to: "q2", symbol: "i" },
  { from: "q2", to: "q5", symbol: "c" },
  { from: "q2", to: "q3", symbol: "i" },
  { from: "q3", to: "q5", symbol: "c" },
  { from: "q3", to: "q4", symbol: "i" },
  { from: "q4", to: "q5", symbol: "c" },
  { from: "q4", to: "q6", symbol: "i" },
];

// NFA States for Authentication with 2FA
const nfaStates = [
  { id: "q0", x: 100, y: 150, isInitial: true, label: "Login" },
  { id: "q1", x: 200, y: 150, label: "User Check" },
  { id: "q2", x: 300, y: 150, label: "Pass (1st)" },
  { id: "q3", x: 400, y: 150, label: "Pass (2nd)" },
  { id: "q4", x: 500, y: 150, label: "Pass (3rd)" },
  { id: "q5", x: 300, y: 250, label: "2FA Choice" },
  { id: "q6", x: 200, y: 350, label: "SMS" },
  { id: "q7", x: 300, y: 350, label: "Email" },
  { id: "q8", x: 400, y: 350, label: "App" },
  { id: "q9", x: 300, y: 450, isFinal: true, label: "Access" },
  { id: "q10", x: 500, y: 250, label: "Blocked" },
];

const nfaTransitions = [
  { from: "q0", to: "q1", symbol: "u" },
  { from: "q0", to: "q0", symbol: "n" },
  { from: "q1", to: "q5", symbol: "c" },
  { from: "q1", to: "q9", symbol: "c" },
  { from: "q1", to: "q2", symbol: "i" },
  { from: "q2", to: "q5", symbol: "c" },
  { from: "q2", to: "q9", symbol: "c" },
  { from: "q2", to: "q3", symbol: "i" },
  { from: "q3", to: "q5", symbol: "c" },
  { from: "q3", to: "q9", symbol: "c" },
  { from: "q3", to: "q4", symbol: "i" },
  { from: "q4", to: "q5", symbol: "c" },
  { from: "q4", to: "q9", symbol: "c" },
  { from: "q4", to: "q10", symbol: "i" },
  { from: "q5", to: "q6", symbol: "s" },
  { from: "q5", to: "q7", symbol: "e" },
  { from: "q5", to: "q8", symbol: "a" },
  { from: "q6", to: "q9", symbol: "v" },
  { from: "q6", to: "q6", symbol: "f" },
  { from: "q7", to: "q9", symbol: "v" },
  { from: "q7", to: "q7", symbol: "f" },
  { from: "q8", to: "q9", symbol: "v" },
  { from: "q8", to: "q8", symbol: "f" },
];

const Index = () => {
  const [dfaCurrentState, setDfaCurrentState] = React.useState("q0");
  const [nfaCurrentState, setNfaCurrentState] = React.useState("q0");
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication System Simulator</h1>
          <p className="text-gray-600">Explore Deterministic and Non-deterministic Authentication Flows</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* DFA Section */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Basic Authentication (DFA)</h2>
            <AuthVisualizer
              states={dfaStates}
              transitions={dfaTransitions}
              currentState={dfaCurrentState}
              type="DFA"
            />
            <AuthControls
              type="DFA"
              currentState={dfaCurrentState}
              onStateChange={setDfaCurrentState}
              allowedInputs={{
                q0: ["u", "n"],
                q1: ["c", "i"],
                q2: ["c", "i"],
                q3: ["c", "i"],
                q4: ["c", "i"],
                q5: [],
                q6: [],
              }}
            />
          </Card>

          {/* NFA Section */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">2FA Authentication (NFA)</h2>
            <AuthVisualizer
              states={nfaStates}
              transitions={nfaTransitions}
              currentState={nfaCurrentState}
              type="NFA"
            />
            <AuthControls
              type="NFA"
              currentState={nfaCurrentState}
              onStateChange={setNfaCurrentState}
              allowedInputs={{
                q0: ["u", "n"],
                q1: ["c", "i"],
                q2: ["c", "i"],
                q3: ["c", "i"],
                q4: ["c", "i"],
                q5: ["s", "e", "a"],
                q6: ["v", "f"],
                q7: ["v", "f"],
                q8: ["v", "f"],
                q9: [],
                q10: [],
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
