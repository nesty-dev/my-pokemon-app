import { Badge } from "@/components/ui/badge";
import { memo } from "react";

// Official Pokemon type colors based on the games
const POKEMON_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-[#A8A77A]", text: "text-white" },
  fire: { bg: "bg-[#EE8130]", text: "text-white" },
  water: { bg: "bg-[#6390F0]", text: "text-white" },
  electric: { bg: "bg-[#F7D02C]", text: "text-black" },
  grass: { bg: "bg-[#7AC74C]", text: "text-black" },
  ice: { bg: "bg-[#96D9D6]", text: "text-black" },
  fighting: { bg: "bg-[#C22E28]", text: "text-white" },
  poison: { bg: "bg-[#A33EA1]", text: "text-white" },
  ground: { bg: "bg-[#E2BF65]", text: "text-black" },
  flying: { bg: "bg-[#A98FF3]", text: "text-black" },
  psychic: { bg: "bg-[#F95587]", text: "text-white" },
  bug: { bg: "bg-[#A6B91A]", text: "text-white" },
  rock: { bg: "bg-[#B6A136]", text: "text-white" },
  ghost: { bg: "bg-[#735797]", text: "text-white" },
  dragon: { bg: "bg-[#6F35FC]", text: "text-white" },
  dark: { bg: "bg-[#705746]", text: "text-white" },
  steel: { bg: "bg-[#B7B7CE]", text: "text-black" },
  fairy: { bg: "bg-[#D685AD]", text: "text-black" },
} as const;

type PokemonTypeProps = {
  type: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function PokemonType({ type, size = "sm", className = "" }: PokemonTypeProps) {
  const normalizedType = type.toLowerCase();
  const colors = POKEMON_TYPE_COLORS[normalizedType] || {
    bg: "bg-gray-400",
    text: "text-white",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      className={`
        capitalize 
        ${colors.bg} 
        ${colors.text} 
        ${sizeClasses[size]}
        border-none
        font-medium
        shadow-sm
        transition-all 
        duration-200
        hover:scale-105
        ${className}
      `}
      variant="secondary"
      title={`${type} type Pokemon`}
    >
      {type}
    </Badge>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(PokemonType);
