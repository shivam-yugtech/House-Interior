import { Home } from "lucide-react";
import { motion } from "framer-motion";
import useRoomStore from "../store/useRoomStore";

const Navbar = () => {
  const saveLayout =
    useRoomStore(
      (state) => state.saveLayout
    );

  const resetLayout =
    useRoomStore(
      (state) => state.resetLayout
    );

  const generateLayout =
    useRoomStore(
      (state) => state.generateLayout
    );

  const toggleDarkMode =
    useRoomStore(
      (state) => state.toggleDarkMode
    );

  return (
    <motion.div
      initial={{
        y: -50,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      className="h-16 bg-white shadow flex items-center justify-between px-8"
    >

      <div className="flex items-center gap-2">

        <Home />

        <h1 className="text-2xl font-bold">
          InteriorCraft
        </h1>

      </div>

      <button
        onClick={saveLayout}
        className="
        bg-black
        text-white
        px-4
        py-2
        rounded-xl
        "
      >
        Save Design
      </button>

      <button
        onClick={generateLayout}
        className="
        bg-purple-500
        text-white
        px-4
        py-2
        rounded-xl
        hover:bg-purple-600
        "
      >
        ✨ Generate Layout
      </button>

      <button
        onClick={resetLayout}
        className="
        bg-red-500
        text-white
        px-4
        py-2
        rounded-xl
        "
      >
        Reset
      </button>

      <button
        onClick={toggleDarkMode}
        className="
        text-2xl
        px-3
        py-2
        rounded-xl
        hover:bg-gray-200
        transition
        "
      >
        🌙
      </button>

    </motion.div>
  );
};

export default Navbar;