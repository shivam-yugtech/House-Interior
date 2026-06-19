import useRoomStore
from "../../store/useRoomStore";

const SavedLayouts = () => {

  const savedLayouts =
    useRoomStore(
      state => state.savedLayouts
    );

  return (

    <div>

      <h2 className="font-bold mb-4">
        Saved Designs
      </h2>

      {savedLayouts.map(
        layout => (

        <div

          key={layout.id}

          className="
          bg-white
          p-3
          rounded-xl
          shadow
          mb-3
          "
        >

          {layout.roomType}

        </div>

      ))}
    </div>

  );
};

export default SavedLayouts;