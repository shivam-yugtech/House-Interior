import { create } from "zustand";

const useRoomStore = create((set) => ({

  roomType: "Living Room",
  roomWidth: 800,
  roomHeight: 600,
  savedLayouts: [],

  furniture: [],

  selectedItem: null,

  darkMode: false,

  addFurniture: (item) =>
    set((state) => ({
      furniture: [...state.furniture, { rotation: 0, ...item }]
    })),

  updateFurniture: (id, updates) =>
    set((state) => ({
      furniture: state.furniture.map((item) =>
        item.uid === id
          ? { ...item, ...updates }
          : item
      )
    })),

  updateRotation: (id, rotation) =>
    set((state) => ({
      furniture: state.furniture.map((item) =>
        item.uid === id
          ? { ...item, rotation }
          : item
      )
    })),

  selectFurniture: (id) =>
    set({
      selectedItem: id
    }),

  setRoomType: (type) =>
    set({
      roomType: type
    }),

  setRoomSize: (width, height) =>
    set({
      roomWidth: width,
      roomHeight: height
    }),

  saveLayout: () =>
    set((state) => {
      const layout = {
        id: Date.now(),
        roomType: state.roomType,
        roomWidth: state.roomWidth,
        roomHeight: state.roomHeight,
        furniture: state.furniture
      };

      const layouts = [...state.savedLayouts, layout];

      localStorage.setItem(
        "interiorcraft-layouts",
        JSON.stringify(layouts)
      );

      return {
        savedLayouts: layouts
      };
    }),

  generateLayout: () =>
    set((state) => ({
      furniture: state.furniture.map(
        (item, index) => ({
          ...item,
          x: 100 + index * 150,
          y: 150
        })
      )
    })),

  resetLayout: () =>
    set({
      furniture: [],
      selectedItem: null
    }),

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode
    }))

}));

export default useRoomStore;