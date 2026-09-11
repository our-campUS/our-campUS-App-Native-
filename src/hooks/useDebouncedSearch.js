import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 300;

// 마지막으로 보낸 요청의 결과만 반영해, 응답이 뒤늦게 도착해도 목록이 검색어와 어긋나지 않게 한다
const useDebouncedSearch = (search, toItem) => {
  const [items, setItems] = useState([]);
  const timerRef = useRef(null);
  const latestRequestRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onChangeText = (text) => {
    clearTimeout(timerRef.current);

    if (!text.trim()) {
      latestRequestRef.current += 1;
      setItems([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      const result = await search(text);
      if (requestId !== latestRequestRef.current) {
        return;
      }
      setItems(Array.isArray(result) ? result.map(toItem) : []);
    }, DEBOUNCE_MS);
  };

  return { items, onChangeText };
};

export default useDebouncedSearch;
