// app/pokemon/page.tsx

import PokemonCard from "@/components/PokemonCard";
import type {
  PokemonListResponse,
  PokemonWithDetails,
} from "@/src/types/pokemon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokemon List - Discover All Pokemon",
  description:
    "Browse through our comprehensive Pokemon database. Discover different Pokemon species, their types, and learn more about each one.",
  openGraph: {
    title: "Pokemon List - Discover All Pokemon",
    description: "Browse through our comprehensive Pokemon database.",
  },
};

async function fetchPokemonList(limit = 50): Promise<PokemonListResponse> {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch Pokemon list");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
}

async function fetchPokemonDetails(
  url: string
): Promise<PokemonWithDetails | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Pokemon details from ${url}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null;
  }
}

export default async function PokemonPage() {
  const pokemonList = await fetchPokemonList(); // Fetch only 5 Pokemon for testing
  try {
    const pokemonWithDetails = await Promise.all(
      pokemonList.results.map(async (pokemon) => {
        try {
          const details = await fetchPokemonDetails(pokemon.url);
          return details;
        } catch (error) {
          console.error(`Failed to fetch Pokemon ${pokemon.name}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validPokemon = pokemonWithDetails.filter(
      (pokemon): pokemon is PokemonWithDetails => pokemon !== null
    );

    console.log(
      `Valid Pokemon: ${validPokemon.length}/${pokemonWithDetails.length}`
    );

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Pokemon Database</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing Pokemon species
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {validPokemon.map((pokemon) => {
            return <PokemonCard key={pokemon.id} pokemon={pokemon} />;
          })}
        </div>

        <div className="text-center pt-6">
          <p className="text-muted-foreground">
            Showing {validPokemon.length} Pokemon. More features coming soon!
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in PokemonPage:", error);
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Pokemon Database</h1>
          <p className="text-red-500">
            Sorry, there was an error loading the Pokemon data. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }
}
