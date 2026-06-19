import { Rnd } from "react-rnd";

import useRoomStore
from "../../store/useRoomStore";

const FurnitureItem = ({ item }) => {

  const updateFurniture =
    useRoomStore(
      (state) => state.updateFurniture
    );

  const selectFurniture =
    useRoomStore(
      (state) => state.selectFurniture
    );

  return (

    <Rnd

      size={{
        width: item.width,
        height: item.height
      }}

      position={{
        x: item.x,
        y: item.y
      }}

      bounds="parent"

      onClick={() =>
        selectFurniture(item.uid)
      }

      onDragStop={(e, d) => {
        const grid = 20;

        updateFurniture(
          item.uid,
          {
            x: Math.round(d.x / grid) * grid,
            y: Math.round(d.y / grid) * grid
          }
        );

      }}

      onResizeStop={(
        e,
        direction,
        ref,
        delta,
        position
      ) => {

        updateFurniture(
          item.uid,
          {
            width:
              parseInt(
                ref.style.width
              ),

            height:
              parseInt(
                ref.style.height
              ),

            ...position
          }
        );

      }}

    >

      <div
        style={{
          transform: `rotate(${item.rotation}deg)`
        }}
        className="
        w-full
        h-full
        flex
        items-center
        justify-center
        text-6xl
        bg-white
        rounded-xl
        shadow-lg
        "
      >

        {item.emoji}

      </div>

    </Rnd>

  );
};

export default FurnitureItem;