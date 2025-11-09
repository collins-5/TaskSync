// COMPLETE ERROR-FREE AI-CHAT.TSX FILE

import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import Markdown from "react-native-markdown-display";
import { Text } from "~/components/ui/text";
import { useAIAssistant } from "~/hooks/useAIAssistant";
import { useSessionInit } from "~/components/core/SessionInitializer";
import supabase from "~/lib/utils/supabase";
import { useRef, useState, useEffect } from "react";
import Icon from "~/components/ui/icon";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import type { FlashList as FlashListType } from "@shopify/flash-list";
import AILoadingMessage from "~/components/core/ai-loading";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ---------------------------------------------------------------
// UTILS: Format Timestamp
// ---------------------------------------------------------------
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Same day, show time
  if (diffDays === 0) {
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  // Within 7 days, show day
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  // Older: show date
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

// ---------------------------------------------------------------
// SKELETON
// ---------------------------------------------------------------
const MessageSkeleton = ({ isUser }: { isUser: boolean }) => (
  <View className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
    {!isUser && (
      <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border" />
    )}
    <View
      className={`max-w-[75%] rounded-3xl px-5 py-3 ${
        isUser ? "bg-primary/30 rounded-tr-none" : "bg-muted/50 rounded-tl-none"
      } border border-border/50`}
    >
      <View className="h-4 bg-foreground/20 rounded-full w-32 mb-2" />
      <View className="h-4 bg-foreground/20 rounded-full w-24" />
    </View>
  </View>
);

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------
type Message = {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
};

type FlashItem =
  | Message
  | { __type: "skeleton" }
  | { __type: "welcome" }
  | { __type: "error"; message: string }
  | { __type: "userLive"; prompt: string; timestamp: string }
  | { __type: "aiThinking"; prompt: string; timestamp: string }
  | { __type: "saving" };

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------
export default function AIChat() {
  const router = useRouter();
  const {
    prompt,
    setPrompt,
    response: aiResponse,
    loading: aiLoading,
    generate,
  } = useAIAssistant();
  const {
    profile,
    chatHistory,
    loading: dataLoading,
    error: dataError,
    refetch,
  } = useSupabaseData();
  const { user } = useSessionInit();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastSentPrompt, setLastSentPrompt] = useState("");
  const [lastSentTimestamp, setLastSentTimestamp] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<FlashListType<FlashItem>>(null);
  const contentHeight = useRef(0);
  const scrollViewHeight = useRef(0);
  const scrollY = useRef(0);

  // -----------------------------------------------------------------
  // 1. Conversation
  // -----------------------------------------------------------------
  const conversation = Array.isArray(chatHistory)
    ? chatHistory
        .filter((e): e is NonNullable<typeof e> => !!e && typeof e === "object")
        .map((e) => ({
          id: e.id,
          prompt: e.prompt ?? "",
          response: e.response ?? "",
          created_at: e.created_at,
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
    : [];

  // -----------------------------------------------------------------
  // 2. Auto‑scroll on new message
  // -----------------------------------------------------------------
  useEffect(() => {
    const t = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(t);
  }, [conversation.length, aiLoading, isSaving, lastSentPrompt]);

  // -----------------------------------------------------------------
  // 3. Animate scroll button
  // -----------------------------------------------------------------
  useEffect(() => {
    Animated.spring(scrollButtonAnim, {
      toValue: showScrollButton ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [showScrollButton]);

  // -----------------------------------------------------------------
  // 4. SAVE ONLY ONCE
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!lastSentPrompt || !aiResponse || aiLoading || !user || isSaving)
      return;
    if (aiResponse.includes("Error:")) {
      setLastSentPrompt("");
      return;
    }
    const save = async () => {
      setIsSaving(true);
      try {
        const { error } = await supabase.from("chat_history").insert({
          user_id: user.id,
          prompt: lastSentPrompt,
          response: aiResponse,
        });
        if (error) throw error;
        await refetch?.();
      } catch (e) {
        console.error("Save error:", e);
      } finally {
        setIsSaving(false);
        setLastSentPrompt("");
        setLastSentTimestamp("");
        setPrompt("");
      }
    };
    save();
  }, [lastSentPrompt, aiResponse, aiLoading, user, refetch]);

  // -----------------------------------------------------------------
  // 5. Sidebar toggle
  // -----------------------------------------------------------------
  const toggleSidebar = () => {
    Animated.spring(sidebarAnim, {
      toValue: isSidebarOpen ? -300 : 0,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  // -----------------------------------------------------------------
  // 6. Send to Gemini
  // -----------------------------------------------------------------
  const handleGenerate = async () => {
    if (!prompt.trim() || aiLoading || dataLoading) return;
    setLastSentPrompt(prompt);
    setLastSentTimestamp(new Date().toISOString());
    await generate(conversation);
  };

  // -----------------------------------------------------------------
  // 7. Scroll tracking – WhatsApp style
  // -----------------------------------------------------------------
  const handleScroll = (event: any) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
    updateScrollButton();
  };
  const handleContentSizeChange = (w: number, h: number) => {
    contentHeight.current = h;
    updateScrollButton();
  };
  const handleLayout = (event: any) => {
    scrollViewHeight.current = event.nativeEvent.layout.height;
    updateScrollButton();
  };
  const updateScrollButton = () => {
    const scrollOffset = scrollY.current;
    const scrollHeight = contentHeight.current;
    const viewHeight = scrollViewHeight.current;
    const distanceFromBottom = scrollHeight - viewHeight - scrollOffset;
    const threshold = 100;
    setShowScrollButton(
      distanceFromBottom > threshold && scrollHeight > viewHeight
    );
  };
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setShowScrollButton(false);
  };

  // -----------------------------------------------------------------
  // 8. Timestamp Component
  // -----------------------------------------------------------------
  const Timestamp = ({ date }: { date: string }) => (
    <Text className="text-xs text-muted-foreground mt-1 self-end">
      {formatTimestamp(date)}
    </Text>
  );

  // -----------------------------------------------------------------
  // 9. FlashList renderItem
  // -----------------------------------------------------------------
  const renderFlashItem: ListRenderItem<FlashItem> = ({ item }) => {
    // Skeleton
    if ("__type" in item && item.__type === "skeleton") {
      return (
        <>
          <MessageSkeleton isUser={false} />
          <MessageSkeleton isUser={true} />
        </>
      );
    }

    // Welcome
    if ("__type" in item && item.__type === "welcome") {
      return (
        <View className="items-center justify-center py-16">
          <View className="w-24 h-24 rounded-3xl bg-primary/20 items-center justify-center mb-6 border border-border">
            <Text className="text-5xl">Chat</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">
            Let's Build
          </Text>
          <Text className="text-muted-foreground text-center px-8 mb-8">
            Ask about tasks, teams, or code
          </Text>
          <View className="w-full space-y-3 px-2">
            {[
              {
                icon: "Idea",
                text: "Task ideas",
                prompt: "Suggest task ideas",
              },
              {
                icon: "Edit",
                text: "Write description",
                prompt: "Write a project description",
              },
              {
                icon: "People",
                text: "Collaboration",
                prompt: "Generate team collaboration strategies",
              },
            ].map((it, i) => (
              <TouchableOpacity
                key={i}
                className="bg-muted p-4 rounded-2xl border border-border"
                onPress={() => setPrompt(it.prompt)}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{it.icon}</Text>
                  <Text className="text-foreground text-sm flex-1">
                    {it.text}
                  </Text>
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="text-muted-foreground"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Error
    if ("__type" in item && item.__type === "error") {
      return (
        <View className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 my-4">
          <Text className="text-red-600 text-center">{item.message}</Text>
        </View>
      );
    }

    // Saved message
    if ("id" in item) {
      const msg = item as Message;
      return (
        <View key={msg.id}>
          {/* User */}
          <View className="flex-row justify-end mb-1">
            <View className="max-w-[80%]">
              <View className="bg-primary rounded-3xl rounded-tr-md px-5 py-3">
                <Text className="text-primary-foreground text-base leading-6">
                  {msg.prompt}
                </Text>
              </View>
              <Timestamp date={msg.created_at} />
            </View>
          </View>
          {/* AI */}
          <View className="flex-row items-start mb-1">
            <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
            <Icon name={'pulse'} size={24}  />
            </View>
            <View className="flex-1 max-w-[85%]">
              <View className="bg-muted rounded-3xl rounded-tl-md px-5 py-4 border border-border">
                <Markdown
                  style={{
                    body: {
                      fontSize: 15,
                      lineHeight: 22,
                    },
                    paragraph: {
                      marginTop: 0,
                      marginBottom: 8,
                    },
                    strong: {
                      fontWeight: "700",
                    },
                    em: {
                      fontStyle: "italic",
                    },
                    heading1: {
                      fontSize: 22,
                      fontWeight: "700",
                      marginTop: 16,
                      marginBottom: 8,
                    },
                    heading2: {
                      fontSize: 20,
                      fontWeight: "600",
                      marginTop: 14,
                      marginBottom: 6,
                    },
                    heading3: {
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 12,
                      marginBottom: 6,
                    },
                    heading4: {
                      fontSize: 16,
                      fontWeight: "600",
                      marginTop: 10,
                      marginBottom: 4,
                    },
                    bullet_list: {
                      marginVertical: 4,
                    },
                    ordered_list: {
                      marginVertical: 4,
                    },
                    list_item: {
                      flexDirection: "row",
                      marginBottom: 4,
                    },
                    bullet_list_icon: {
                      marginRight: 8,
                      marginTop: 2,
                    },
                    ordered_list_icon: {
                      marginRight: 8,
                      marginTop: 2,
                    },
                    code_inline: {
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      fontSize: 14,
                      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    },
                    code_block: {
                      padding: 12,
                      borderRadius: 8,
                      marginVertical: 8,
                      fontSize: 13,
                      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    },
                    fence: {
                      padding: 12,
                      borderRadius: 8,
                      marginVertical: 8,
                      fontSize: 13,
                      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    },
                    blockquote: {
                      borderLeftWidth: 4,
                      paddingLeft: 12,
                      paddingVertical: 8,
                      marginVertical: 8,
                    },
                    hr: {
                      height: 1,
                      marginVertical: 16,
                    },
                  }}
                >
                  {msg.response}
                </Markdown>
              </View>
              <Timestamp date={msg.created_at} />
            </View>
          </View>
        </View>
      );
    }

    // Live user prompt
    if ("__type" in item && item.__type === "userLive") {
      return (
        <View className="flex-row justify-end mb-1">
          <View className="max-w-[80%]">
            <View className="bg-primary rounded-3xl rounded-tr-md px-5 py-3">
              <Text className="text-primary-foreground text-base leading-6">
                {item.prompt}
              </Text>
            </View>
            <Timestamp date={item.timestamp} />
          </View>
        </View>
      );
    }

    // AI thinking
    if ("__type" in item && item.__type === "aiThinking") {
      return (
        <>
          <View className="flex-row justify-end mb-1">
            <View className="max-w-[80%]">
              <View className="bg-primary rounded-3xl rounded-tr-md px-5 py-3">
                <Text className="text-primary-foreground text-base leading-6">
                  {item.prompt}
                </Text>
              </View>
              <Timestamp date={item.timestamp} />
            </View>
          </View>
          <View className="flex-row items-start mb-4">
            <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
            </View>
            <AILoadingMessage />
          </View>
        </>
      );
    }

    // Saving
    if ("__type" in item && item.__type === "saving") {
      return <AILoadingMessage />;
    }

    return null;
  };

  // -----------------------------------------------------------------
  // 10. Sidebar history item
  // -----------------------------------------------------------------
  const RenderHistoryItem = ({
    item,
  }: {
    item: { id: number; prompt: string; created_at: string; response: string };
  }) => (
    <TouchableOpacity
      key={item.id}
      className="bg-muted p-3 rounded-xl mb-2 border border-border mx-3"
      onPress={() => {
        setPrompt(item.prompt);
        toggleSidebar();
      }}
    >
      <Text className="text-foreground font-medium text-sm" numberOfLines={2}>
        {item.prompt}
      </Text>
      <Text className="text-muted-foreground text-xs mt-1">
        {formatTimestamp(item.created_at)}
      </Text>
    </TouchableOpacity>
  );

  // -----------------------------------------------------------------
  // 11. FlashList data
  // -----------------------------------------------------------------
  const flashData: FlashItem[] = [
    ...(dataLoading ? [{ __type: "skeleton" } as const] : []),
    ...(!dataLoading &&
    conversation.length === 0 &&
    !lastSentPrompt &&
    !aiLoading &&
    !isSaving
      ? [{ __type: "welcome" } as const]
      : []),
    ...(dataError ? [{ __type: "error", message: dataError } as const] : []),
    ...conversation,
    ...(lastSentPrompt && !aiLoading && lastSentTimestamp
      ? [
          {
            __type: "userLive",
            prompt: lastSentPrompt,
            timestamp: lastSentTimestamp,
          } as const,
        ]
      : []),
    ...(aiLoading && lastSentTimestamp
      ? [
          {
            __type: "aiThinking",
            prompt: lastSentPrompt,
            timestamp: lastSentTimestamp,
          } as const,
        ]
      : []),
    ...(isSaving ? [{ __type: "saving" } as const] : []),
  ];

  // -----------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------
  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-background">
        {/* Overlay */}
        {isSidebarOpen && (
          <TouchableOpacity
            className="absolute inset-0 bg-black/50 z-10"
            onPress={toggleSidebar}
            activeOpacity={1}
          />
        )}

        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-12 pb-6 bg-primary">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <TouchableOpacity
                  onPress={toggleSidebar}
                  className="mr-4 w-10 h-10 rounded-full bg-muted items-center justify-center border border-border"
                >
                  <Icon name="menu" size={24} className="text-foreground" />
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-foreground tracking-tight">
                    AI Assistant
                  </Text>
                  <Text className="text-white mt-1 text-xs">
                    {profile ? `Hey ${profile.first_name}!` : "AI Magic"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Area */}
          <View className="flex-1">
            <FlashList
              ref={scrollViewRef}
              data={flashData}
              renderItem={renderFlashItem}
              keyExtractor={(item, idx) =>
                "id" in item
                  ? item.id.toString()
                  : `${"__type" in item ? item.__type : "unknown"}-${idx}`
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 20,
                paddingHorizontal: 16,
              }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleLayout}
              scrollEnabled={!isSidebarOpen}
              removeClippedSubviews={true}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />

            {/* Input bar */}
            <View className="px-4 pb-4 bg-background">
              <View className="bg-muted rounded-3xl shadow-2xl border border-border px-4 py-3">
                <View className="flex-row items-end space-x-3">
                  <View className="flex-1">
                    <Input
                      value={prompt}
                      onChangeText={setPrompt}
                      placeholder="Ask anything..."
                      className="rounded-2xl px-4 py-3 bg-background border-border"
                      placeholderTextColor="rgb(148,163,184)"
                      multiline
                      maxLength={1000}
                      editable={!isSidebarOpen && !dataLoading}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={
                      aiLoading ||
                      dataLoading ||
                      !prompt.trim() ||
                      isSidebarOpen ||
                      isSaving
                    }
                    className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
                      aiLoading ||
                      dataLoading ||
                      !prompt.trim() ||
                      isSidebarOpen ||
                      isSaving
                        ? "bg-muted"
                        : "bg-primary"
                    }`}
                  >
                    <Icon
                      name={aiLoading || isSaving ? "loading" : "send"}
                      size={20}
                      className={
                        aiLoading ||
                        dataLoading ||
                        !prompt.trim() ||
                        isSidebarOpen ||
                        isSaving
                          ? "text-muted-foreground"
                          : "text-primary-foreground"
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Scroll to Bottom FAB */}
            <Animated.View
              style={{
                position: "absolute",
                bottom: 100,
                right: 24,
                zIndex: 30,
                opacity: scrollButtonAnim,
                transform: [
                  { scale: scrollButtonAnim },
                  {
                    translateY: scrollButtonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
              pointerEvents={showScrollButton ? "auto" : "none"}
            >
              <TouchableOpacity
                onPress={scrollToBottom}
                className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-2xl"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Icon
                  name="chevron-down"
                  size={28}
                  className="text-primary-foreground"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* SIDEBAR */}
          <Animated.View
            className="absolute top-0 left-0 h-full w-[300px] bg-background shadow-2xl z-20 border-r border-border"
            style={{ transform: [{ translateX: sidebarAnim }] }}
            pointerEvents={isSidebarOpen ? "auto" : "none"}
          >
            <View className="pt-12 px-4 pb-4 bg-primary/10">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 items-center justify-center">
                    <Text className="text-2xl">History</Text>
                  </View>
                  <Text className="text-xl font-bold text-foreground">
                    History
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleSidebar}
                  className="p-2 rounded-full bg-muted"
                >
                  <Icon name="close" size={20} className="text-foreground" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1">
              {dataLoading ? (
                <View className="px-4 py-8">
                  <Text className="text-muted-foreground text-center text-sm">
                    Loading…
                  </Text>
                </View>
              ) : chatHistory.length === 0 ? (
                <View className="items-center justify-center py-8 px-4">
                  <Text className="text-muted-foreground text-center text-sm">
                    No history yet
                  </Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {chatHistory
                    .filter(
                      (c): c is NonNullable<typeof c> =>
                        !!c && typeof c === "object"
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((item) => (
                      <RenderHistoryItem key={item.id} item={item} />
                    ))}
                </ScrollView>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
