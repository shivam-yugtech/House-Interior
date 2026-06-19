import { furnitureCatalog } from "../data/furnitureCatalog";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import RoomTemplates from "../Components/Templates/RoomTemplates";
import { useState } from "react";

const FurnitureCard = ({ item }) => {

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: item.id
    });

  const style = transform
    ? {
        transform: `translate3d(
          ${transform.x}px,
          ${transform.y}px,
          0
        )`
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      className="
      bg-white/70
      backdrop-blur-lg
      border
      border-white/20
      shadow-xl
      rounded-xl
      p-4
      cursor-grab
      "
    >
      <div className="text-4xl">
        {item.emoji}
      </div>

      <h2>{item.name}</h2>
    </motion.div>
  );
};

const FurnitureSidebar = () => {
  const categories = [
    "All",
    "Beds",
    "Sofas",
    "Chairs",
    "Tables"
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredFurniture =
    furnitureCatalog.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All"
          ? true
          : item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <motion.div
      initial={{
        x: -100,
        opacity: 0
      }}
      animate={{
        x: 0,
        opacity: 1
      }}
      className="
      w-72
      bg-gray-100
      p-4
      overflow-y-auto
      "
    >
      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search Furniture..."
        className="
        w-full
        p-3
        rounded-xl
        border
        mb-4
        "
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setCategory(cat)
            }
            className="
            px-3
            py-1
            rounded-full
            bg-gray-200
            "
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="font-bold mb-4">
        Room Templates
      </h2>

      <RoomTemplates />

      <div className="space-y-4">
        {filteredFurniture.map((item) => (
          <FurnitureCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FurnitureSidebar;