"use client";

import React, { useActionState, useRef, useTransition } from "react";
import { submitPQRS } from "../actions/submitPQRS";
import { usePQRSStore } from "../stores/pqrsStore";
import { Step1Evento } from "./Step1Evento";
import { Step2Solicitante } from "./Step2Solicitante";
import { Step3Soportes } from "./Step3Soportes";

type SubmissionState = {
  success: boolean;
  message: string;
};

const initialSubmissionState: SubmissionState = {
  success: false,
  message: "",
};

const navigationButtonClassName =
  "rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none";

const backButtonClassName = `${navigationButtonClassName} bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95`;

const nextButtonClassName = `${navigationButtonClassName} bg-ransa-600 text-white hover:bg-ransa-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`;

const submitButtonClassName =
  "rounded-full bg-gradient-to-r from-ransa-600 to-ransa-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-ransa-700 hover:to-ransa-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ransa-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 active:scale-98";

function NavigationButtons() {
  const currentStep = usePQRSStore((state) => state.currentStep);
  const setCurrentStep = usePQRSStore((state) => state.setCurrentStep);
  const validateStep = usePQRSStore((state) => state.validateStep);
  const markStepCompleted = usePQRSStore((state) => state.markStepCompleted);
  const [isSubmitting] = useTransition();

  const canGoNext = validateStep(currentStep);
  const isLastStep = currentStep === 3;

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep - 1)}
          className={backButtonClassName}
        >
          ← Volver
        </button>
      ) : (
        <div />
      )}

      {!isLastStep ? (
        <button
          type="button"
          onClick={() => {
            if (canGoNext) {
              markStepCompleted(currentStep);
              setCurrentStep(currentStep + 1);
            }
          }}
          disabled={!canGoNext}
          className={nextButtonClassName}
        >
          Siguiente →
        </button>
      ) : (
        <button
          type="submit"
          disabled={!canGoNext || isSubmitting}
          className={submitButtonClassName}
          onClick={() => markStepCompleted(3)}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Enviando...</span>
            </div>
          ) : (
            "Aceptar y Enviar"
          )}
        </button>
      )}
    </div>
  );
}

export default function PQRSForm() {
  const [submissionState, formAction] = useActionState(
    submitPQRS,
    initialSubmissionState,
  );
  const [isSubmitting, startSubmission] = useTransition();

  const currentStep = usePQRSStore((state) => state.currentStep);
  const formData = usePQRSStore((state) => state.formData);
  const completedSteps = usePQRSStore((state) => state.completedSteps);
  const resetStore = usePQRSStore((state) => state.resetStore);
  const validateStep = usePQRSStore((state) => state.validateStep);
  const [clientError, setClientError] = React.useState("");
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (submissionState.success) {
      // Resetear store y formulario
      resetStore();
      setClientError("");
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [submissionState.success, resetStore]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError("");

    // Validar que todos los pasos estén completos
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setClientError(
        "Por favor, completa todos los campos obligatorios en los tres pasos.",
      );
      return;
    }

    // Preparar FormData para envío
    const form = new FormData();
    form.append("emails", JSON.stringify(formData.emails));
    form.append("channel", "web");
    form.append("eventDate", formData.eventDate);
    form.append("confirmDate", formData.confirmDate);
    form.append("empresa", formData.empresa);
    form.append("relacion", formData.relacion);
    form.append("tipoSolicitud", formData.tipoSolicitud);
    form.append("nombreCliente", formData.nombreCliente);
    form.append("nitCc", formData.nitCc);
    form.append("descripcion", formData.descripcion);
    form.append("valorVenta", formData.valorVenta);
    form.append("valorCosto", formData.valorCosto);
    form.append("telefono", formData.telefono);
    form.append("region", formData.region);
    form.append("ciudades", formData.ciudades);
    form.append("transportProcess", formData.transportProcess);
    form.append("proceso", formData.proceso);
    form.append("tipoServicio", formData.tipoServicio);
    form.append("supportFileUrl", formData.supportFileUrl);
    form.append("supportFile2Url", formData.supportFile2Url);
    form.append("certificateFileUrl", formData.certificateFileUrl);
    form.append("valueSheetFileUrl", formData.valueSheetFileUrl);

    startSubmission(() => {
      void formAction(form);
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-ransa-50 via-white to-ransa-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
        >
          {/* Error Messages */}
          {clientError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-pulse flex items-start gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{clientError}</span>
            </div>
          )}

          {submissionState.message && !clientError && (
            <div
              className={`rounded-lg p-4 text-xs font-semibold flex items-start gap-2.5 border ${
                submissionState.success
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {submissionState.success ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              <span>{submissionState.message}</span>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-6 min-h-96">
            {currentStep === 1 && <Step1Evento />}
            {currentStep === 2 && <Step2Solicitante />}
            {currentStep === 3 && <Step3Soportes />}
          </div>

          {/* Navigation Buttons */}
          <NavigationButtons />
        </form>
      </div>
    </div>
  );
}
