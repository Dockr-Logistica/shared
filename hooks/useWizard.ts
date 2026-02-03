import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { z } from 'zod';
import { signupCurrentStepAtom, signupFormDataAtom, SignupFormData } from '../store/atoms/signupWizardAtoms';

interface UseWizardReturn {
  formData: SignupFormData;
  updateFormData: (updates: Partial<SignupFormData>) => void;
  handleNext: () => boolean;
  handleBack: () => void;
  errors: Record<string, string>;
  clearErrors: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isValid: boolean;
}

export function useWizard(validationSchema?: z.ZodSchema): UseWizardReturn {
  const [currentStep, setCurrentStep] = useAtom(signupCurrentStepAtom);
  const [formData, setFormData] = useAtom(signupFormDataAtom);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((key) => delete next[key]);
      return next;
    });
  }, [setFormData]);

  const validate = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema, formData]);

  const handleNext = useCallback((): boolean => {
    const isValid = validate();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
    return isValid;
  }, [validate, setCurrentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setErrors({});
  }, [setCurrentStep]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    formData,
    updateFormData,
    handleNext,
    handleBack,
    errors,
    clearErrors,
    currentStep,
    setCurrentStep,
    isValid,
  };
}
