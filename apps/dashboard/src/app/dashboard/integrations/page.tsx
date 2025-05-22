"use client";

import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Użyj client API do pobrania postów
        const data = await api.getPosts<any>();
        
        setPosts(data.docs || []);
      } catch (err) {
        console.error("Błąd podczas pobierania postów:", err);
        setError("Nie udało się pobrać danych z API. Sprawdź konsolę po więcej szczegółów.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Integracja z API</h1>
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {error && (
        <Card className="p-6 bg-destructive/10 text-destructive">
          <p>{error}</p>
        </Card>
      )}
      
      {!isLoading && !error && posts.length === 0 && (
        <Card className="p-6">
          <p>Brak postów do wyświetlenia.</p>
        </Card>
      )}
      
      {!isLoading && !error && posts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              {post.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm">{post.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 