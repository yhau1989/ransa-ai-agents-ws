import { create } from "zustand";

export interface PQRSFormData {
  // Step 1: Evento
  eventDate: string;
  confirmDate: string;
  empresa: string;
  relacion: string;
  tipoSolicitud: string;

  // Step 2: Solicitante
  nombreCliente: string;
  nitCc: string;
  descripcion: string;
  valorVenta: string;
  valorCosto: string;
  emails: string[];
  telefono: string;
  region: string;
  ciudades: string;
  transportProcess: string;
  proceso: string;
  tipoServicio: string;

  // Step 3: Soportes
  supportFileUrl: string;
  supportFile2Url: string;
  certificateFileUrl: string;
  valueSheetFileUrl: string;
}

interface PQRSStore {
  currentStep: number;
  formData: PQRSFormData;
  completedSteps: number[];
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<PQRSFormData>) => void;
  setEmails: (emails: string[]) => void;
  setFileUrl: (
    field: keyof Pick<
      PQRSFormData,
      | "supportFileUrl"
      | "supportFile2Url"
      | "certificateFileUrl"
      | "valueSheetFileUrl"
    >,
    url: string,
  ) => void;
  resetStore: () => void;
  markStepCompleted: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  validateStep: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
  getFormDataForSubmission: () => PQRSFormData;
}

const initialFormData: PQRSFormData = {
  // Step 1
  eventDate: "",
  confirmDate: "",
  empresa: "",
  relacion: "",
  tipoSolicitud: "",
  // Step 2
  nombreCliente: "",
  nitCc: "",
  descripcion: "",
  valorVenta: "",
  valorCosto: "",
  emails: [],
  telefono: "",
  region: "",
  ciudades: "",
  transportProcess: "",
  proceso: "",
  tipoServicio: "",
  // Step 3
  supportFileUrl: "",
  supportFile2Url: "",
  certificateFileUrl: "",
  valueSheetFileUrl: "",
};

export const usePQRSStore = create<PQRSStore>((set, get) => ({
  currentStep: 1,
  formData: initialFormData,
  completedSteps: [],

  setCurrentStep: (step: number) => {
    set({ currentStep: Math.max(1, Math.min(3, step)) });
  },

  updateFormData: (data: Partial<PQRSFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  markStepCompleted: (step: number) => {
    set((state) => {
      if (state.completedSteps.includes(step)) return state;
      return { completedSteps: [...state.completedSteps, step] };
    });
  },

  isStepCompleted: (step: number): boolean => {
    return get().completedSteps.includes(step);
  },

  setEmails: (emails: string[]) => {
    set((state) => ({
      formData: { ...state.formData, emails },
    }));
  },

  setFileUrl: (field, url) => {
    set((state) => ({
      formData: { ...state.formData, [field]: url },
    }));
  },

  resetStore: () => {
    set({
      currentStep: 1,
      formData: initialFormData,
      completedSteps: [],
    });
  },

  validateStep: (step: number): boolean => {
    const { formData } = get();

    switch (step) {
      case 1:
        return (
          formData.eventDate !== "" &&
          formData.confirmDate !== "" &&
          formData.empresa !== "" &&
          formData.relacion !== "" &&
          formData.tipoSolicitud !== ""
        );
      case 2:
        return (
          formData.nombreCliente !== "" &&
          formData.nitCc !== "" &&
          formData.descripcion !== "" &&
          formData.valorVenta !== "" &&
          formData.valorCosto !== "" &&
          formData.emails.length > 0 &&
          formData.telefono !== "" &&
          formData.region !== "" &&
          formData.ciudades !== "" &&
          formData.proceso !== "" &&
          formData.tipoServicio !== ""
        );
      case 3:
        return (
          formData.supportFileUrl !== "" &&
          formData.supportFile2Url !== "" &&
          formData.valueSheetFileUrl !== ""
        );
      default:
        return false;
    }
  },

  canProceedToStep: (step: number): boolean => {
    const { validateStep, formData } = get();

    // Can proceed to step if all previous steps are valid
    if (step === 2) {
      return validateStep(1);
    }
    if (step === 3) {
      return validateStep(1) && validateStep(2);
    }
    return true;
  },

  getFormDataForSubmission: (): PQRSFormData => {
    return get().formData;
  },
}));
