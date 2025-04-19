
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface State {
  id: string;
  x: number;
  y: number;
  isInitial?: boolean;
  isFinal?: boolean;
}

interface Transition {
  from: string;
  to: string;
  symbol: string;
}

interface AutomatonVisualizerProps {
  states: State[];
  transitions: Transition[];
  currentState: string;
  type: 'DFA' | 'NFA';
}

const AutomatonVisualizer = ({ states, transitions, currentState, type }: AutomatonVisualizerProps) => {
  const stateRadius = 30;
  const width = 400;
  const height = 300;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{type} Visualization</h3>
      <div className="relative w-[400px] h-[300px] border border-gray-200 rounded-lg">
        <svg width={width} height={height}>
          {/* Draw transitions */}
          {transitions.map((transition, index) => {
            const fromState = states.find(s => s.id === transition.from);
            const toState = states.find(s => s.id === transition.to);
            if (!fromState || !toState) return null;

            return (
              <g key={index}>
                <line
                  x1={fromState.x}
                  y1={fromState.y}
                  x2={toState.x}
                  y2={toState.y}
                  stroke={currentState === fromState.id ? "#6E59A5" : "#CBD5E1"}
                  strokeWidth="2"
                />
                <text
                  x={(fromState.x + toState.x) / 2}
                  y={(fromState.y + toState.y) / 2 - 10}
                  textAnchor="middle"
                  fill="#64748B"
                >
                  {transition.symbol}
                </text>
              </g>
            );
          })}

          {/* Draw states */}
          {states.map((state) => (
            <g key={state.id}>
              <circle
                cx={state.x}
                cy={state.y}
                r={stateRadius}
                fill={currentState === state.id ? "#9b87f5" : "white"}
                stroke={state.isFinal ? "#6E59A5" : "#CBD5E1"}
                strokeWidth={state.isFinal ? "3" : "2"}
              />
              {state.isInitial && (
                <ArrowRight
                  className="absolute text-gray-500"
                  style={{
                    top: state.y - 12,
                    left: state.x - 45,
                  }}
                />
              )}
              <text
                x={state.x}
                y={state.y + 5}
                textAnchor="middle"
                fill={currentState === state.id ? "white" : "#1F2937"}
              >
                {state.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
};

export default AutomatonVisualizer;
