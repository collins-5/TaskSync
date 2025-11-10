// src/screens/NewsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  TextInput,
  ListRenderItem,
} from "react-native";
import { NewsArticle, NewsCategory } from "@/types/news";
import { NewsService } from "~/hooks/newsService";
import { capitalize, formatDate } from "~/lib/utils/formatters";
import Icon from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import SkeletonList from "~/components/core/SkeletonList";
import { NewsItemSkeleton } from "~/components/news/NewsItemSkeleton";

const categories: NewsCategory[] = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
];

const NewsScreen: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [category, setCategory] = useState<NewsCategory>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

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
    if (url) Linking.openURL(url);
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
            {formatDate(item.publishedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (cat: NewsCategory) => (
    <TouchableOpacity
      key={cat}
      className={`px-4 py-2 mx-1 rounded-full ${
        category === cat ? "bg-primary" : "bg-gray-100"
      }`}
      onPress={() => setCategory(cat)}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-semibold ${
          category === cat ? "text-white" : "text-gray-600"
        }`}
      >
        {capitalize(cat)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          News Feed
        </Text>
      </View>
      <View className="p-2">
        <Input
          className="flex-1 w-full text-base text-gray-900"
          placeholder="Search news..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          iconComponent={<Icon name={"magnify"} size={24} />}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            className="z-50 absolute top-5 right-4"
          >
            <Icon name="close-circle" size={20} className="text-gray-500" />
          </TouchableOpacity>
        )}
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

      {loading && !refreshing ? (
        <View className="flex-1 px-4 pt-4">
          <SkeletonList skeletonComponent={NewsItemSkeleton} count={6} />
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default NewsScreen;
