import Navbar from "../Navbar/Navbar";
import FurnitureSidebar from "../Sidebar/FurnitureSidebar";
import RoomCanvas from "../Components/Canvas/RoomCanvas";
import PropertyPanel from "../Components/PropertyPanel/PropertyPanel";
import useRoomStore from "../store/useRoomStore";

const Dashboard = () => {

  const darkMode =
    useRoomStore(
      (state) => state.darkMode
    );

  return (

    <div className={
      darkMode
        ? "min-h-screen bg-slate-900 p-4"
        : "min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4"
    }>

      <Navbar />

      <div
        className="
        flex
        h-[calc(100vh-64px)]
        "
      >

        <FurnitureSidebar />

        <div
          className="
          flex-1
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          "
        >
          <RoomCanvas />
        </div>

        <PropertyPanel />

      </div>

    </div>

  );
};

export default Dashboard;