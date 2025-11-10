// types.ts - Type Definitions
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

// NewsService.ts - API Service
const API_KEY = "f66b46eb655241d18cadb4e2f50070fd";
const BASE_URL = "https://newsapi.org/v2";

export class NewsService {
  static async getTopHeadlines(
    country: string = "us",
    category?: NewsCategory
  ): Promise<NewsArticle[]> {
    try {
      let url = `${BASE_URL}/top-headlines?country=${country}&apiKey=${API_KEY}`;
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      const data: NewsResponse = await response.json();

      if (data.status === "ok") {
        return data.articles;
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching top headlines:", error);
      throw error;
    }
  }

  static async searchNews(
    query: string,
    sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt"
  ): Promise<NewsArticle[]> {
    try {
      const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&apiKey=${API_KEY}`;

      const response = await fetch(url);
      const data: NewsResponse = await response.json();

      if (data.status === "ok") {
        return data.articles;
      } else {
        throw new Error("Failed to search news");
      }
    } catch (error) {
      console.error("Error searching news:", error);
      throw error;
    }
  }

  static async getNewsByCategory(
    category: NewsCategory,
    country: string = "us"
  ): Promise<NewsArticle[]> {
    return NewsService.getTopHeadlines(country, category);
  }
}

// NewsScreen.tsx - Example Screen Component
import React, { useState, useEffect, JSX } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  ListRenderItem,
  TextInput,
} from "react-native";

const NewsScreen: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [category, setCategory] = useState<NewsCategory>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const categories: NewsCategory[] = [
    "general",
    "business",
    "technology",
    "sports",
    "entertainment",
    "health",
  ];

  useEffect(() => {
    if (!isSearching) {
      fetchNews();
    }
  }, [category, isSearching]);

  const fetchNews = async (): Promise<void> => {
    try {
      setLoading(true);
      const news = await NewsService.getTopHeadlines("us", category);
      setArticles(news);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (): Promise<void> => {
    if (searchQuery.trim().length === 0) {
      setIsSearching(false);
      fetchNews();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const results = await NewsService.searchNews(searchQuery.trim());
      setArticles(results);
    } catch (error) {
      console.error("Error searching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = (): void => {
    setSearchQuery("");
    setIsSearching(false);
    fetchNews();
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    if (isSearching && searchQuery) {
      await handleSearchSubmit();
    } else {
      await fetchNews();
    }
    setRefreshing(false);
  };

  const openArticle = (url: string): void => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderArticle: ListRenderItem<NewsArticle> = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4 overflow-hidden shadow-md"
      onPress={() => openArticle(item.url)}
      activeOpacity={0.7}
    >
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          className="w-full h-48 bg-gray-200"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {item.description && (
          <Text
            className="text-sm text-gray-600 mb-3 leading-5"
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-blue-600 font-semibold">
            {item.source.name}
          </Text>
          <Text className="text-xs text-gray-400">
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (cat: NewsCategory): JSX.Element => (
    <TouchableOpacity
      key={cat}
      className={`px-4 py-2 mx-1 rounded-full ${
        category === cat ? "bg-blue-600" : "bg-gray-100"
      }`}
      onPress={() => setCategory(cat)}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-semibold ${
          category === cat ? "text-white" : "text-gray-600"
        }`}
      >
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900 mb-3">News</Text>

        {/* Search Input */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Text className="text-gray-400 text-lg mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Search news..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-2">
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isSearching && (
        <View className="bg-white border-b border-gray-200">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => renderCategoryButton(item)}
            keyExtractor={(item) => item}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          />
        </View>
      )}

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-base">No articles found</Text>
          </View>
        }
      />
    </View>
  );
};

export default NewsScreen;

