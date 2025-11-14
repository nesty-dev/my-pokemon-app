"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BackButtonProps = {
  href?: string;
  label?: string;
  useRouterBack?: boolean;
};

export default function BackButton({
  href = "/pokemon",
  label = "Back to Pokemon List",
  useRouterBack = true, // Default to true to preserve query strings
}: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleClick = () => {
    if (useRouterBack && canGoBack) {
      // This preserves the query string of the previous URL
      try {
        router.back();
      } catch (error) {
        console.warn("Router.back() failed, using fallback:", error);
        router.push(href);
      }
    } else {
      // Fallback to the provided href if no history
      router.push(href);
    }
  };

  // Always use the enhanced handleClick for better query string preservation
  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
