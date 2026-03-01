import { useState } from 'react';

const useToast = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => setToastVisible(false);

  return { toastVisible, toastMessage, showToast, hideToast };
};

export default useToast;
