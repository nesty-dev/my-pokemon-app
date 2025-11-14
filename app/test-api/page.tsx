"use client";

import { useEffect, useState } from "react";

export default function TestApiPage() {
  const [testResult, setTestResult] = useState<string>("Testing...");

  useEffect(() => {
    async function testApi() {
      try {
        // Test the Pokemon API
        console.log("Testing Pokemon API...");

        const response = await fetch("https://pokeapi.co/api/v2/pokemon/1");
        console.log("API Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response data:", data);

        setTestResult(
          `Success! Got data for ${data.name} with ${data.types?.length} types`
        );
      } catch (error) {
        console.error("API test failed:", error);
        setTestResult(`Error: ${error}`);
      }
    }

    testApi();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <p>{testResult}</p>
    </div>
  );
}
