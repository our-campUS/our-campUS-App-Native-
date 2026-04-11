import { create } from 'zustand';

export const DEFAULT_LOCATION = {
  latitude: 37.5044,
  longitude: 126.9568,
};

const useLocationStore = create((set) => ({
  userLocation: DEFAULT_LOCATION,
  setUserLocation: (location) => set({ userLocation: location }),
}));

export default useLocationStore;
