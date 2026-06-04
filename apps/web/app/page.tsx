"use client";

import BannerIntro from "./components/BannerIntro";
import HeaderPage from "./components/HeaderPage";
import PQRSForm from "./components/PQRSForm";
import Stepper from "./components/Stepper";
import { usePQRSStore } from "./stores/pqrsStore";

export default function Home() {
  const steps = [
    { number: 1, label: "Evento" },
    { number: 2, label: "Solicitante" },
    { number: 3, label: "Soportes" },
  ];

  const currentStep = usePQRSStore((state) => state.currentStep);
  const completedSteps = usePQRSStore((state) => state.completedSteps);

  return (
    <>
      <HeaderPage />
      <BannerIntro />
      <Stepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
      <PQRSForm />
    </>
  );
}
