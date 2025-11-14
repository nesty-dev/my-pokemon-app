// app/pokemon/[name]/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import type { Metadata } from "next";

type PokemonDetail = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
  height: number;
  weight: number;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
};

type Props = {
  params: Promise<{ name: string }>;
};

async function fetchPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch Pokemon:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const pokemon = await fetchPokemon(name);

  if (!pokemon) {
    return {
      title: "Pokemon Not Found",
    };
  }

  const pokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const image =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return {
    title: `${pokemonName} - Pokemon Details`,
    description: `Learn about ${pokemonName}, a ${pokemon.types
      .map((t) => t.type.name)
      .join("/")} type Pokemon. View stats, abilities, and more!`,
    openGraph: {
      title: `${pokemonName} - Pokemon Details`,
      description: `Learn about ${pokemonName}, a ${pokemon.types
        .map((t) => t.type.name)
        .join("/")} type Pokemon.`,
      images: image ? [{ url: image, alt: pokemonName }] : [],
    },
  };
}

export default async function PokemonDetailPage({ params }: Props) {
  const { name } = await params;
  const pokemon = await fetchPokemon(name);

  if (!pokemon) {
    notFound();
  }

  const primaryImage =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-600",
    fairy: "bg-pink-300",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <BackButton />
      </div>

      {/* Main Pokemon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize text-3xl text-center">
            {pokemon.name}
            <span className="text-lg text-muted-foreground ml-2">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {primaryImage && (
            <div className="relative">
              <Image
                src={primaryImage}
                alt={pokemon.name}
                width={200}
                height={200}
                className="drop-shadow-lg"
                priority
              />
            </div>
          )}

          {/* Types */}
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  typeColors[type.type.name] || "bg-gray-400"
                }`}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-center">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold">
                {(pokemon.height / 10).toFixed(1)}m
              </div>
              <div className="text-sm text-muted-foreground">Height</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-2xl font-bold">
                {(pokemon.weight / 10).toFixed(1)}kg
              </div>
              <div className="text-sm text-muted-foreground">Weight</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abilities Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Abilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability.ability.name}
                className={`px-3 py-1 rounded-full text-sm ${
                  ability.is_hidden
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {ability.ability.name.replace("-", " ")}
                {ability.is_hidden && " (Hidden)"}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Base Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pokemon.stats.map((stat) => {
              const statName = stat.stat.name.replace("-", " ");
              const percentage = Math.min((stat.base_stat / 200) * 100, 100);

              return (
                <div key={stat.stat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{statName}</span>
                    <span className="font-bold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
