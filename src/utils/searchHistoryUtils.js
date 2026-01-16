import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_SIZE = 20;

/**
 * 검색 기록 저장
 * @param {Object} searchItem
 * @param {string} searchItem.type - 'KEYWORD' | 'LOCATION'
 * @param {string} searchItem.text - 표시될 텍스트
 * @param {string} searchItem.placeId - 장소 ID (LOCATION 타입)
 * @param {Object} searchItem.data - 추가 데이터
 */
export const addSearchHistory = async (searchItem) => {
  try {
    const history = await getSearchHistory();

    // 중복 제거 (같은 텍스트 있으면 삭제)
    const filteredHistory = history.filter(
      (item) => item.text !== searchItem.text
    );

    // 새 항목을 맨 앞에 추가
    const newHistory = [
      {
        ...searchItem,
        id: Date.now().toString(),
        timestamp: Date.now(),
      },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY_SIZE);

    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('검색 기록 저장 실패:', error);
    return [];
  }
};

/**
 * 검색 기록 가져오기
 */
export const getSearchHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('검색 기록 불러오기 실패:', error);
    return [];
  }
};

/**
 * 특정 검색 기록 삭제
 */
export const removeSearchHistory = async (id) => {
  try {
    const history = await getSearchHistory();
    const newHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('검색 기록 삭제 실패:', error);
    return [];
  }
};

/**
 * 모든 검색 기록 삭제
 */
export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    return [];
  } catch (error) {
    console.error('검색 기록 전체 삭제 실패:', error);
    return [];
  }
};
