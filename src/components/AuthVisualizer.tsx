import React from 'react';
import { Card } from "@/components/ui/card";

interface State {
  id: string;
  x: number;
  y: number;
  isInitial?: boolean;
  isFinal?: boolean;
  label: string;
}

interface Transition {
  from: string;
  to: string;
  symbol: string;
}

interface AuthVisualizerProps {
  states: State[];
  transitions: Transition[];
  currentState: string;
  type: 'DFA' | 'NFA';
}

const AuthVisualizer = ({ states, transitions, currentState, type }: AuthVisualizerProps) => {
  const stateRadius = 30;
  const width = 600;
  const height = 500;

  return (
    <Card className="p-4">
      <div className="w-full h-[500px] border border-gray-200 rounded-lg overflow-hidden">
        <svg width={width} height={height}>
          {/* Draw transitions */}
          {transitions.map((transition, index) => {
            const fromState = states.find(s => s.id === transition.from);
            const toState = states.find(s => s.id === transition.to);
            if (!fromState || !toState) return null;

            // Self-referencing transition
            if (transition.from === transition.to) {
              return (
                <g key={index}>
                  <path
                    d={`M ${fromState.x + stateRadius} ${fromState.y} 
                        C ${fromState.x + 50} ${fromState.y - 50},
                          ${fromState.x + 50} ${fromState.y - 50},
                          ${fromState.x + stateRadius} ${fromState.y}`}
                    fill="none"
                    stroke={currentState === fromState.id ? "#6E59A5" : "#CBD5E1"}
                    strokeWidth="2"
                  />
                  <text
                    x={fromState.x + 40}
                    y={fromState.y - 30}
                    textAnchor="middle"
                    fill="#64748B"
                    className="text-sm"
                  >
                    {transition.symbol}
                  </text>
                </g>
              );
            }

            // Calculate mid-point for curved path
            const midX = (fromState.x + toState.x) / 2;
            const midY = (fromState.y + toState.y) / 2 - 20;

            return (
              <g key={index}>
                <path
                  d={`M ${fromState.x} ${fromState.y} Q ${midX} ${midY} ${toState.x} ${toState.y}`}
                  fill="none"
                  stroke={currentState === fromState.id ? "#6E59A5" : "#CBD5E1"}
                  strokeWidth="2"
                />
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  fill="#64748B"
                  className="text-sm"
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
              {state.isFinal && (
                <circle
                  cx={state.x}
                  cy={state.y}
                  r={stateRadius - 5}
                  fill="none"
                  stroke={state.isFinal ? "#6E59A5" : "#CBD5E1"}
                  strokeWidth="2"
                />
              )}
              {state.isInitial && (
                <path
                  d={`M${state.x - 45},${state.y} L${state.x - stateRadius},${state.y}`}
                  stroke="#CBD5E1"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
              <text
                x={state.x}
                y={state.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={currentState === state.id ? "white" : "#1F2937"}
                className="text-sm font-medium"
              >
                {state.label}
              </text>
            </g>
          ))}
          
          {/* Arrow marker definition */}
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
                fill="#CBD5E1"
              />
            </marker>
          </defs>
        </svg>
      </div>
    </Card>
  );
};

export default AuthVisualizer;
