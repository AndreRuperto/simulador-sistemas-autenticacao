
import React, { useState } from 'react';
import AutomatonVisualizer from '@/components/AutomatonVisualizer';
import AutomatonControls from '@/components/AutomatonControls';

// Example DFA for a simple binary number divisible by 3
const dfaStates = [
  { id: "q0", x: 100, y: 150, isInitial: true },
  { id: "q1", x: 200, y: 150 },
  { id: "q2", x: 300, y: 150, isFinal: true },
];

const dfaTransitions = [
  { from: "q0", to: "q0", symbol: "0" },
  { from: "q0", to: "q1", symbol: "1" },
  { from: "q1", to: "q2", symbol: "0" },
  { from: "q1", to: "q0", symbol: "1" },
  { from: "q2", to: "q1", symbol: "0" },
  { from: "q2", to: "q2", symbol: "1" },
];

// Example NFA for strings ending with "01"
const nfaStates = [
  { id: "s0", x: 100, y: 150, isInitial: true },
  { id: "s1", x: 200, y: 150 },
  { id: "s2", x: 300, y: 150, isFinal: true },
];

const nfaTransitions = [
  { from: "s0", to: "s0", symbol: "0" },
  { from: "s0", to: "s0", symbol: "1" },
  { from: "s0", to: "s1", symbol: "0" },
  { from: "s1", to: "s2", symbol: "1" },
];

const Index = () => {
  const [dfaCurrentState, setDfaCurrentState] = useState("q0");
  const [nfaCurrentState, setNfaCurrentState] = useState("s0");

  const handleDfaInput = (symbol: string) => {
    const transition = dfaTransitions.find(
      t => t.from === dfaCurrentState && t.symbol === symbol
    );
    if (transition) {
      setDfaCurrentState(transition.to);
    }
  };

  const handleNfaInput = (symbol: string) => {
    const possibleTransitions = nfaTransitions.filter(
      t => t.from === nfaCurrentState && t.symbol === symbol
    );
    if (possibleTransitions.length > 0) {
      // For simplicity, we'll just take the first possible transition
      setNfaCurrentState(possibleTransitions[0].to);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automaton Simulator</h1>
          <p className="text-gray-600">Explore Deterministic and Non-deterministic Finite Automata</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* DFA Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Deterministic Finite Automaton</h2>
            <AutomatonVisualizer
              states={dfaStates}
              transitions={dfaTransitions}
              currentState={dfaCurrentState}
              type="DFA"
            />
            <AutomatonControls
              onInput={handleDfaInput}
              allowedInputs={["0", "1"]}
              currentState={dfaCurrentState}
              type="DFA"
            />
          </div>

          {/* NFA Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Non-deterministic Finite Automaton</h2>
            <AutomatonVisualizer
              states={nfaStates}
              transitions={nfaTransitions}
              currentState={nfaCurrentState}
              type="NFA"
            />
            <AutomatonControls
              onInput={handleNfaInput}
              allowedInputs={["0", "1"]}
              currentState={nfaCurrentState}
              type="NFA"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
