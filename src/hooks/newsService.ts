// src/lib/newsService.ts
import { NewsArticle, NewsCategory, NewsResponse } from "@/types/news";

const API_KEY = "f66b46eb655241d18cadb4e2f50070fd";
const BASE_URL = "https://newsapi.org/v2";

export class NewsService {
    static async getTopHeadlines(
        country: string = "us",
        category?: NewsCategory
    ): Promise<NewsArticle[]> {
        let url = `${BASE_URL}/top-headlines?country=${country}&apiKey=${API_KEY}`;
        if (category) {
            url += `&category=${category}`;
        }

        const response = await fetch(url);
        const data: NewsResponse = await response.json();

        if (data.status !== "ok") {
            throw new Error("Failed to fetch news");
        }

        return data.articles;
    }

    static async searchNews(
        query: string,
        sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt"
    ): Promise<NewsArticle[]> {
        const url = `${BASE_URL}/everything?q=${encodeURIComponent(
            query
        )}&sortBy=${sortBy}&apiKey=${API_KEY}`;

        const response = await fetch(url);
        const data: NewsResponse = await response.json();

        if (data.status !== "ok") {
            throw new Error("Failed to search news");
        }

        return data.articles;
    }

    static async getNewsByCategory(
        category: NewsCategory,
        country: string = "us"
    ): Promise<NewsArticle[]> {
        return this.getTopHeadlines(country, category);
    }
}