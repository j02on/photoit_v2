'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface AnimationBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  rotate: 'up' | 'down';
}

export default function AnimationBox({
  children,
  rotate,
  ...props
}: AnimationBoxProps) {
  return (
    <div className="flex flex-col h-full" {...props}>
      <div
        className={`flex flex-col ${
          rotate === 'up'
            ? 'animate-[upRolling_24s_linear_infinite]'
            : 'animate-[downRolling_24s_linear_infinite]'
        }`}
      >
        {children}
      </div>
      <div
        className={`flex flex-col ${
          rotate === 'up'
            ? 'animate-[copyUpRolling_24s_linear_infinite]'
            : 'animate-[copyDownRolling_24s_linear_infinite]'
        }`}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes upRolling {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-100%);
          }
          50.01% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        @keyframes copyUpRolling {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-200%);
          }
        }

        @keyframes downRolling {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(100%);
          }
          50.01% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes copyDownRolling {
          0% {
            transform: translateY(-200%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
