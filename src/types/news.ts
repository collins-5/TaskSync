// src/types/news.ts
export interface NewsSource {
    id: string | null;
    name: string;
}

export interface NewsArticle {
    source: NewsSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export type NewsCategory =
    | "general"
    | "business"
    | "technology"
    | "sports"
    | "entertainment"
    | "health";