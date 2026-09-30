import { useEffect, useRef } from 'react';

// 닫히는 애니메이션 도중 바뀌어 깜빡이지 않도록
const useHeldWhileHidden = (value, visible) => {
  const heldRef = useRef(value);

  useEffect(() => {
    if (visible) heldRef.current = value;
  }, [value, visible]);

  return visible ? value : heldRef.current;
};

export default useHeldWhileHidden;
