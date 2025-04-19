
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface AuthControlsProps {
  type: 'DFA' | 'NFA';
  currentState: string;
  onStateChange: (state: string) => void;
  allowedInputs: {
    [key: string]: string[];
  };
}

const inputLabels: { [key: string]: string } = {
  u: "User Exists",
  n: "User Not Found",
  c: "Correct Password",
  i: "Incorrect Password",
  s: "SMS 2FA",
  e: "Email 2FA",
  a: "App 2FA",
  v: "Valid Code",
  f: "Invalid Code",
};

const AuthControls = ({ type, currentState, onStateChange, allowedInputs }: AuthControlsProps) => {
  const handleInput = (input: string) => {
    const newState = currentState;
    
    // Add descriptive toast messages based on the input and current state
    if (input === 'n') {
      toast({
        title: "User Not Found",
        description: "Please check the username and try again.",
        variant: "destructive",
      });
    } else if (input === 'i') {
      toast({
        title: "Incorrect Password",
        description: "Please try again.",
        variant: "destructive",
      });
    } else if (input === 'c') {
      if (type === 'NFA') {
        toast({
          title: "Password Correct",
          description: "Please complete 2FA verification.",
        });
      } else {
        toast({
          title: "Access Granted",
          description: "Login successful!",
        });
      }
    } else if (input === 'v') {
      toast({
        title: "2FA Verified",
        description: "Access granted!",
      });
    } else if (input === 'f') {
      toast({
        title: "Invalid 2FA Code",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    // Update the state based on the input
    if (type === 'DFA') {
      handleDFATransition(input);
    } else {
      handleNFATransition(input);
    }
  };

  const handleDFATransition = (input: string) => {
    if (input === 'u') onStateChange('q1');
    else if (input === 'n') onStateChange('q0');
    else if (input === 'c') onStateChange('q5');
    else if (input === 'i') {
      if (currentState === 'q1') onStateChange('q2');
      else if (currentState === 'q2') onStateChange('q3');
      else if (currentState === 'q3') onStateChange('q4');
      else if (currentState === 'q4') onStateChange('q6');
    }
  };

  const handleNFATransition = (input: string) => {
    if (input === 'u') onStateChange('q1');
    else if (input === 'n') onStateChange('q0');
    else if (input === 'c') onStateChange('q5');
    else if (input === 'i') {
      if (currentState === 'q1') onStateChange('q2');
      else if (currentState === 'q2') onStateChange('q3');
      else if (currentState === 'q3') onStateChange('q4');
      else if (currentState === 'q4') onStateChange('q10');
    }
    else if (input === 's') onStateChange('q6');
    else if (input === 'e') onStateChange('q7');
    else if (input === 'a') onStateChange('q8');
    else if (input === 'v') onStateChange('q9');
    else if (input === 'f') {
      // Stay in the same state for invalid 2FA code
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Controls</h3>
          <span className="text-sm text-gray-500">
            Current State: {currentState}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {allowedInputs[currentState]?.map((input) => (
            <Button
              key={input}
              variant="outline"
              onClick={() => handleInput(input)}
              className="min-w-[100px]"
            >
              {inputLabels[input]}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AuthControls;
