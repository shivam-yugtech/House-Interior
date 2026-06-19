import {
  Sofa, Bed, Armchair, Lamp, Flower2, Box, Table2, BookOpen, ChefHat
} from "lucide-react";

export const COLORS = {
  sage: "#84A98C",
  sageDeep: "#52796F",
  beige: "#EDE0D4",
  terracotta: "#D4A373",
  cream: "#FAF7F2",
  charcoal: "#2F3E46",
};

export const CATEGORIES = [
  { id: "sofas", label: "Sofas", icon: Sofa },
  { id: "chairs", label: "Chairs", icon: Armchair },
  { id: "tables", label: "Tables", icon: Table2 },
  { id: "beds", label: "Beds", icon: Bed },
  { id: "storage", label: "Storage", icon: Box },
  { id: "decor", label: "Decor", icon: BookOpen },
  { id: "lighting", label: "Lighting", icon: Lamp },
  { id: "plants", label: "Plants", icon: Flower2 },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
];

export const STYLES = ["Modern", "Minimal", "Scandinavian", "Luxury", "Vintage"];

export const CATALOG = [
  { id: "f1", name: "Sectional Sofa", cat: "sofas", style: "Modern", w: 220, h: 90, color: "#84A98C" },
  { id: "f2", name: "Loveseat", cat: "sofas", style: "Minimal", w: 150, h: 85, color: "#A3B899" },
  { id: "f3", name: "Chesterfield Sofa", cat: "sofas", style: "Vintage", w: 200, h: 95, color: "#B08968" },
  { id: "f4", name: "Accent Chair", cat: "chairs", style: "Scandinavian", w: 70, h: 70, color: "#D4A373" },
  { id: "f5", name: "Dining Chair", cat: "chairs", style: "Minimal", w: 45, h: 50, color: "#E6CCB2" },
  { id: "f6", name: "Lounge Chair", cat: "chairs", style: "Luxury", w: 80, h: 85, color: "#C9967A" },
  { id: "f7", name: "Coffee Table", cat: "tables", style: "Modern", w: 110, h: 60, color: "#8C7A6B" },
  { id: "f8", name: "Dining Table", cat: "tables", style: "Scandinavian", w: 160, h: 90, color: "#A1887F" },
  { id: "f9", name: "Side Table", cat: "tables", style: "Minimal", w: 45, h: 45, color: "#BCAAA4" },
  { id: "f10", name: "Queen Bed", cat: "beds", style: "Modern", w: 160, h: 200, color: "#84A98C" },
  { id: "f11", name: "King Bed", cat: "beds", style: "Luxury", w: 195, h: 205, color: "#52796F" },
  { id: "f12", name: "Single Bed", cat: "beds", style: "Minimal", w: 95, h: 195, color: "#A3B899" },
  { id: "f13", name: "Bookshelf", cat: "storage", style: "Scandinavian", w: 90, h: 35, color: "#9C6644" },
  { id: "f14", name: "Wardrobe", cat: "storage", style: "Modern", w: 120, h: 60, color: "#7F5539" },
  { id: "f15", name: "TV Console", cat: "storage", style: "Minimal", w: 150, h: 40, color: "#B08968" },
  { id: "f16", name: "Area Rug", cat: "decor", style: "Vintage", w: 200, h: 140, color: "#DDA15E" },
  { id: "f17", name: "Wall Art", cat: "decor", style: "Modern", w: 60, h: 6, color: "#606C38" },
  { id: "f18", name: "Mirror", cat: "decor", style: "Luxury", w: 50, h: 6, color: "#BC6C25" },
  { id: "f19", name: "Floor Lamp", cat: "lighting", style: "Scandinavian", w: 35, h: 35, color: "#D4A373" },
  { id: "f20", name: "Pendant Light", cat: "lighting", style: "Modern", w: 30, h: 30, color: "#84A98C" },
  { id: "f21", name: "Table Lamp", cat: "lighting", style: "Minimal", w: 22, h: 22, color: "#EDE0D4" },
  { id: "f22", name: "Fiddle Leaf Fig", cat: "plants", style: "Scandinavian", w: 45, h: 45, color: "#52796F" },
  { id: "f23", name: "Snake Plant", cat: "plants", style: "Minimal", w: 30, h: 30, color: "#40916C" },
  { id: "f24", name: "Monstera", cat: "plants", style: "Modern", w: 50, h: 50, color: "#2D6A4F" },
  { id: "f25", name: "Kitchen Island", cat: "kitchen", style: "Modern", w: 140, h: 80, color: "#8C7A6B" },
  { id: "f26", name: "Bar Stool", cat: "kitchen", style: "Minimal", w: 35, h: 35, color: "#BCAAA4" },
];

export const ROOM_TEMPLATES = [
  { id: "bedroom", label: "Bedroom", w: 14, h: 12, defaults: ["f10", "f14", "f21"] },
  { id: "living", label: "Living Room", w: 16, h: 13, defaults: ["f1", "f7", "f15", "f16"] },
  { id: "office", label: "Office", w: 12, h: 10, defaults: ["f9", "f5", "f13"] },
  { id: "study", label: "Study Room", w: 10, h: 9, defaults: ["f13", "f5"] },
  { id: "kitchen", label: "Kitchen", w: 14, h: 11, defaults: ["f25", "f26"] },
  { id: "custom", label: "Custom Room", w: 12, h: 12, defaults: [] },
];

let _id = 1000;
export const nextId = () => `item-${_id++}`;