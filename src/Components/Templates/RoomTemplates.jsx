import { roomTemplates }
from "../../data/roomTemplates";

import useRoomStore
from "../../store/useRoomStore";

const RoomTemplates = () => {

  const setRoomType =
    useRoomStore(
      state => state.setRoomType
    );

  const setRoomSize =
    useRoomStore(
      state => state.setRoomSize
    );

  const loadTemplate = (room) => {

    setRoomType(room.name);

    setRoomSize(
      room.width,
      room.height
    );

  };

  return (

    <div className="space-y-3">

      {roomTemplates.map(room => (

        <button

          key={room.id}

          onClick={() =>
            loadTemplate(room)
          }

          className="
          w-full
          bg-white
          p-3
          rounded-xl
          shadow
          "
        >

          {room.name}

        </button>

      ))}

    </div>

  );
};

export default RoomTemplates;