import { useState } from 'react';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러가 있으면 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const setValue = (name, value) => {
    handleChange(name, value);
  };

  const setError = (name, error) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error === null || error === undefined) {
        delete newErrors[name];
      } else {
        newErrors[name] = error;
      }
      return newErrors;
    });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const validate = (validationRules = {}) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const rule = validationRules[name];
      const value = values[name];

      if (
        rule.required &&
        (!value || (typeof value === 'string' && !value.trim()))
      ) {
        newErrors[name] = rule.message || `${name}은(는) 필수입니다.`;
        isValid = false;
      } else if (rule.validate && typeof rule.validate === 'function') {
        const error = rule.validate(value, values);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    handleChange,
    setValue,
    setError,
    reset,
    validate,
  };
};

export default useForm;
