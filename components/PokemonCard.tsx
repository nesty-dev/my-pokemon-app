import PokemonType from "@/components/PokemonType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PokemonWithDetails } from "@/src/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type PokemonCardProps = {
  pokemon: PokemonWithDetails;
  priority?: boolean;
};

type PokemonCardSkeletonProps = {
  className?: string;
};

// Skeleton component for loading state
function PokemonCardSkeleton({ className }: PokemonCardSkeletonProps) {
  return (
    <Card className={`h-full animate-pulse ${className || ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-8"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-muted rounded-lg"></div>
        </div>
        <div className="flex gap-1 justify-center">
          <div className="h-6 bg-muted rounded-full w-12"></div>
          <div className="h-6 bg-muted rounded-full w-12"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extract image component for better organization
function PokemonImage({
  pokemon,
  primaryImage,
}: {
  pokemon: PokemonWithDetails;
  primaryImage: string | null;
}) {
  if (!primaryImage) {
    return (
      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-24 group-hover:scale-110 transition-transform duration-200">
      <Image
        src={primaryImage}
        alt={`${pokemon.name} sprite`}
        width={96}
        height={96}
        className="object-contain drop-shadow-md"
        loading="lazy"
        sizes="96px"
      />
    </div>
  );
}

// Main component - now accepts full Pokemon details instead of fetching
export default function PokemonCard({
  pokemon,
  priority = false,
}: PokemonCardProps) {
  // Get the best available image with proper null safety
  const primaryImage =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default ||
    null;

  return (
    <Link
      href={`/pokemon/${pokemon?.name || "unknown"}`}
      className="group block transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      prefetch={false}
      aria-label={`View details for ${pokemon?.name || "Unknown Pokemon"}`}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 focus-within:border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="capitalize text-lg font-semibold truncate">
              {pokemon?.name || "Unknown Pokemon"}
            </CardTitle>
            <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">
              #{(pokemon?.id || 0).toString().padStart(3, "0")}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-center">
            <Suspense
              fallback={
                <div className="w-24 h-24 bg-muted rounded-lg animate-pulse"></div>
              }
            >
              <PokemonImage pokemon={pokemon} primaryImage={primaryImage} />
            </Suspense>
          </div>

          <div className="flex flex-wrap gap-1 justify-center min-h-6">
            {pokemon?.types && pokemon.types.length > 0 ? (
              pokemon.types.map((type) => (
                <PokemonType
                  key={type?.type?.name || "unknown"}
                  type={type?.type?.name || "unknown"}
                />
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No types</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Export skeleton for use in parent components
export { PokemonCardSkeleton };
