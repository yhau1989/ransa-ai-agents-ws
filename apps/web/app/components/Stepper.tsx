"use client";

import { useScrollDirection } from "../hooks/useScrollDirection";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const { isSticky, ref, sentinelRef } = useScrollDirection();

  return (
    <>
      <div ref={sentinelRef} className="h-0 w-0" />
      <div
        ref={ref}
        className={`w-full py-4 px-4 z-40 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200 transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0" : "relative"
        }`}
        style={{
          position: isSticky ? "fixed" : "relative",
          top: isSticky ? 0 : "auto",
          left: isSticky ? 0 : "auto",
          right: isSticky ? 0 : "auto",
        }}
      >
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                    step.number <= currentStep
                      ? "bg-ransa-800 text-white"
                      : "bg-gray-200 text-gray-600 shadow-gray-500"
                  }`}
                >
                  {step.number}
                </div>
                <p
                  className={`mt-2 text-xs font-medium ${
                    step.number <= currentStep
                      ? "text-ransa-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all ${
                    step.number < currentStep ? "bg-green-600" : "bg-gray-300"
                  }`}
                  style={{ marginTop: "-2rem" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
