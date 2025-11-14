"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type PaginationProps = {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export default function Pagination({
  currentPage,
  hasNext,
  hasPrevious,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      const query = params.toString();
      return query ? `?${query}` : "";
    },
    [searchParams]
  );

  const handlePrevious = () => {
    if (hasPrevious && currentPage > 1) {
      router.push(`/pokemon${createPageURL(currentPage - 1)}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/pokemon${createPageURL(currentPage + 1)}`);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <ButtonGroup>
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!hasPrevious || currentPage <= 1}
          className="flex items-center gap-2 w-28 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button variant="outline" className="font-medium w-20">
          Page {currentPage}
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!hasNext}
          className="flex items-center gap-2 w-28 cursor-pointer"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
