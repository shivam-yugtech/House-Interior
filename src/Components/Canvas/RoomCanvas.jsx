import {
  useDroppable
}
from "@dnd-kit/core";

import useRoomStore
from "../../store/useRoomStore";

import FurnitureItem
from "./FurnitureItem";

const RoomCanvas = () => {

  const furniture =
    useRoomStore(
      (state) => state.furniture
    );

  const roomWidth =
    useRoomStore(
      (state) => state.roomWidth
    );

  const roomHeight =
    useRoomStore(
      (state) => state.roomHeight
    );

  const { setNodeRef } =
    useDroppable({
      id: "room"
    });

  return (

    <div

      ref={setNodeRef}

      style={{
        width: roomWidth,
        height: roomHeight,
        backgroundSize: "20px 20px",
        backgroundImage: `
          linear-gradient(
          to right,
          #e5e7eb 1px,
          transparent 1px
          ),

          linear-gradient(
          to bottom,
          #e5e7eb 1px,
          transparent 1px
          )
        `
      }}

      className="
      bg-white
      relative
      mx-auto
      my-8
      shadow-xl
      rounded-2xl
      "

    >

      {furniture.map(
        (item) => (

          <FurnitureItem

            key={item.uid}

            item={item}

          />

        )
      )}

    </div>

  );
};

export default RoomCanvas;