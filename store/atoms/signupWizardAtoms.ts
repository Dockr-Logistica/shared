import { atom } from 'jotai';

export interface SignupFormData {
  accountType?: 'shipper' | 'carrier';

  cnpj?: string;
  legalName?: string;
  tradeName?: string;

  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  address?: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };

  password?: string;
  passwordConfirmation?: string;

  documents?: File[];

  termsAccepted?: boolean;
}

const initialFormData: SignupFormData = {};

export const signupCurrentStepAtom = atom<number>(1);
export const signupFormDataAtom = atom<SignupFormData>(initialFormData);

export const resetSignupAtom = atom(null, (get, set) => {
  set(signupCurrentStepAtom, 1);
  set(signupFormDataAtom, initialFormData);
});
