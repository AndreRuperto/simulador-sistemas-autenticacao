
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AutomatonControlsProps {
  onInput: (symbol: string) => void;
  allowedInputs: string[];
  currentState: string;
  type: 'DFA' | 'NFA';
}

const AutomatonControls = ({ onInput, allowedInputs, currentState, type }: AutomatonControlsProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Controls</h3>
          <span className="text-sm text-gray-500">Current State: {currentState}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {allowedInputs.map((input) => (
            <Button
              key={input}
              variant="outline"
              onClick={() => onInput(input)}
              className="min-w-[60px]"
            >
              {input}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AutomatonControls;
