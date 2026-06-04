import BannerIntro from "./components/BannerIntro";
import HeaderPage from "./components/HeaderPage";
import PQRSForm from "./components/PQRSForm";
import Stepper from "./components/Stepper";

export default function Home() {
  const steps = [
    { number: 1, label: "Evento" },
    { number: 2, label: "Solicitante" },
    { number: 3, label: "Soportes" },
  ];

  return (
    <>
      <HeaderPage />
      <BannerIntro />
      <Stepper steps={steps} currentStep={1} />
      <PQRSForm />
    </>
  );
}
