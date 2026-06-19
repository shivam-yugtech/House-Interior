import Dashboard from "./pages/Dashboard";

import {
  DndContext
} from "@dnd-kit/core";

import { v4 as uuid } from "uuid";

import useRoomStore
from "./store/useRoomStore";

import {
  furnitureCatalog
}
from "./data/furnitureCatalog";

function App() {

  const addFurniture =
    useRoomStore(
      (state) => state.addFurniture
    );

  const handleDragEnd = (
    event
  ) => {

    const { active, over } =
      event;

    if (
      over &&
      over.id === "room"
    ) {

      const item =
        furnitureCatalog.find(
          (f) =>
            f.id === active.id
        );

      addFurniture({
        ...item,

        uid: uuid(),

        x: 150,

        y: 150
      });

    }
  };

  return (

    <DndContext
      onDragEnd={handleDragEnd}
    >

      <Dashboard />

    </DndContext>

  );
}

export default App;