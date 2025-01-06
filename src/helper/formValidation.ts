export interface ValidationRule {
  [key: string]: (value: unknown) => boolean;
}

export const defaultValidationRules: ValidationRule = {
  required: value => value !== null && value !== undefined && value !== '',
};

export const validateForm = (
  formData: unknown,
  validationRules: ValidationRule
): boolean => {
  if (!formData || typeof formData !== 'object') {
    return false;
  }
  for (const key in formData) {
    const value = (formData as Record<string, unknown>)[key];
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (!validateForm(value, validationRules)) {
        return false;
      }
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (!validateForm(item, validationRules)) {
          return false;
        }
      }
    } else {
      for (const rule in validationRules) {
        if (!validationRules[rule](value)) {
          return false;
        }
      }
    }
  }
  return true;
};
