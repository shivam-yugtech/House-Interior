import useRoomStore
from "../../store/useRoomStore";

const PropertyPanel = () => {

  const furniture =
    useRoomStore(
      (state) => state.furniture
    );

  const selectedItem =
    useRoomStore(
      (state) => state.selectedItem
    );

  const updateRotation =
    useRoomStore(
      (state) => state.updateRotation
    );

  const updateFurniture =
    useRoomStore(
      (state) => state.updateFurniture
    );

  const item =
    furniture.find(
      (f) =>
        f.uid === selectedItem
    );

  if (!item)
    return (
      <div className="w-72 bg-white/70 backdrop-blur-lg shadow-xl border border-white/20 p-4">
        Select Furniture
      </div>
    );

  return (

    <div
      className="
      w-72
      bg-white/70
      backdrop-blur-lg
      shadow-xl
      border
      border-white/20
      p-4
      "
    >

      <h2 className="font-bold mb-4">
        Properties
      </h2>

      <p>X : {item.x}</p>

      <p>Y : {item.y}</p>

      <div className="mb-2">
        <label className="block text-sm mb-1">Width:</label>
        <input
          type="number"
          value={item.width}
          onChange={(e) =>
            updateFurniture(
              item.uid,
              {
                width:
                Number(e.target.value)
              }
            )
          }
          className="w-full border px-2 py-1"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Height:</label>
        <input
          type="number"
          value={item.height}
          onChange={(e) =>
            updateFurniture(
              item.uid,
              {
                height:
                Number(e.target.value)
              }
            )
          }
          className="w-full border px-2 py-1"
        />
      </div>

      <p>
        Rotation :
        {item.rotation}°
      </p>

      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="360"
          value={item.rotation}
          onChange={(e) =>
            updateFurniture(
              item.uid,
              {
                rotation:
                Number(e.target.value)
              }
            )
          }
          className="w-full"
        />
      </div>

      <button
        onClick={() =>
          updateRotation(
            item.uid,
            item.rotation + 15
          )
        }
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Rotate 15°
      </button>

    </div>

  );
};

export default PropertyPanel;