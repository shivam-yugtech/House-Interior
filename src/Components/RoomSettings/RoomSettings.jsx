import useRoomStore
from "../../store/useRoomStore";

const RoomSettings = () => {

  const roomWidth =
    useRoomStore(
      state => state.roomWidth
    );

  const roomHeight =
    useRoomStore(
      state => state.roomHeight
    );

  const setRoomSize =
    useRoomStore(
      state => state.setRoomSize
    );

  return (

    <div>

      <h2>
        Room Settings
      </h2>

      <input

        type="number"

        value={roomWidth}

        onChange={(e)=>

          setRoomSize(
            Number(e.target.value),
            roomHeight
          )

        }

      />

      <input

        type="number"

        value={roomHeight}

        onChange={(e)=>

          setRoomSize(
            roomWidth,
            Number(e.target.value)
          )

        }

      />

    </div>

  );
};

export default RoomSettings;