// src/app/(tabs)/ai-chat.tsx
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
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

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ---------------------------------------------------------------
// Skeleton
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
  const [isSaving, setIsSaving] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
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
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
    : [];

  // -----------------------------------------------------------------
  // 2. Auto-scroll on new message
  // -----------------------------------------------------------------
  useEffect(() => {
    const t = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(t);
  }, [conversation.length, aiLoading, isSaving]);

  // -----------------------------------------------------------------
  // 3. Animate scroll button in/out
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
    if (!lastSentPrompt || !aiResponse || aiLoading || !user || isSaving) return;

    if (aiResponse.includes("Error:")) {
      setLastSentPrompt("");
      return;
    }

    const save = async () => {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from("chat_history")
          .insert({ user_id: user.id, prompt: lastSentPrompt, response: aiResponse });

        if (error) throw error;
        await refetch?.();
      } catch (e) {
        console.error("Save error:", e);
      } finally {
        setIsSaving(false);
        setLastSentPrompt("");
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
    await generate(conversation);
  };

  // -----------------------------------------------------------------
  // 7. Sidebar history item
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
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <Text className="text-muted-foreground text-xs mt-1" numberOfLines={1}>
        {item.response}
      </Text>
    </TouchableOpacity>
  );

  // -----------------------------------------------------------------
  // 8. Scroll tracking – WhatsApp style
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
    
    // Show button if user has scrolled up more than 100px from bottom
    const distanceFromBottom = scrollHeight - viewHeight - scrollOffset;
    const threshold = 100;
    
    setShowScrollButton(distanceFromBottom > threshold && scrollHeight > viewHeight);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setShowScrollButton(false);
  };

  // -----------------------------------------------------------------
  // 9. UI
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
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
              scrollEnabled={!isSidebarOpen}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleLayout}
            >
            {/* Loading */}
            {dataLoading && (
              <>
                <MessageSkeleton isUser={false} />
                <MessageSkeleton isUser={true} />
              </>
            )}

            {/* Welcome */}
            {!dataLoading &&
              conversation.length === 0 &&
              !lastSentPrompt &&
              !aiLoading &&
              !isSaving && (
                <View className="items-center justify-center py-16">
                  <View className="w-24 h-24 rounded-3xl bg-primary/20 items-center justify-center mb-6 border border-border">
                    <Text className="text-5xl">💬</Text>
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
                        icon: "💡",
                        text: "Task ideas",
                        prompt: "Suggest task ideas",
                      },
                      {
                        icon: "✏️",
                        text: "Write description",
                        prompt: "Write a project description",
                      },
                      {
                        icon: "👥",
                        text: "Collaboration",
                        prompt: "Generate team collaboration strategies",
                      },
                    ].map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        className="bg-muted p-4 rounded-2xl border border-border"
                        onPress={() => setPrompt(item.prompt)}
                      >
                        <View className="flex-row items-center">
                          <Text className="text-2xl mr-3">{item.icon}</Text>
                          <Text className="text-foreground text-sm flex-1">
                            {item.text}
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
              )}

            {/* DB error */}
            {dataError && (
              <View className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 my-4">
                <Text className="text-red-600 text-center">{dataError}</Text>
              </View>
            )}

            {/* Saved messages */}
            {conversation.map((msg) => (
              <View key={msg.id}>
                <View className="flex-row justify-end mb-4">
                  <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md px-5 py-3">
                    <Text className="text-primary-foreground text-base leading-6">
                      {msg.prompt}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start mb-4">
                  <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
                    <Text className="text-lg">🤖</Text>
                  </View>
                  <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 border border-border">
                    <Markdown
                      style={{
                        body: { color: "inherit", fontSize: 15, lineHeight: 22 },
                        paragraph: { marginVertical: 4 },
                        strong: { fontWeight: "600" },
                      }}
                    >
                      {msg.response}
                    </Markdown>
                  </View>
                </View>
              </View>
            ))}

            {/* Live user prompt */}
            {lastSentPrompt && !aiLoading && (
              <View className="flex-row justify-end mb-4">
                <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md px-5 py-3">
                  <Text className="text-primary-foreground text-base leading-6">
                    {lastSentPrompt}
                  </Text>
                </View>
              </View>
            )}

            {/* AI thinking */}
            {aiLoading && (
              <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
                  <Text className="text-lg">🤖</Text>
                </View>
                <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 border border-border">
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#22c55e" />
                    <Text className="text-foreground ml-3">Thinking…</Text>
                  </View>
                </View>
              </View>
            )}

            {/* AI SAVING */}
            {isSaving && (
              <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
                  <Text className="text-lg">💾</Text>
                </View>
                <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 border border-border">
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text className="text-foreground ml-3">Saving...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

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
                    aiLoading || dataLoading || !prompt.trim() || isSidebarOpen || isSaving
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

          {/* Scroll to Bottom FAB – WhatsApp Style */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 100,
              right: 24,
              zIndex: 30,
              opacity: scrollButtonAnim,
              transform: [
                {
                  scale: scrollButtonAnim,
                },
                {
                  translateY: scrollButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
            pointerEvents={showScrollButton ? 'auto' : 'none'}
          >
            <TouchableOpacity
              onPress={scrollToBottom}
              className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-2xl"
              activeOpacity={0.8}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Icon name="chevron-down" size={28} className="text-primary-foreground" />
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
                  <Text className="text-2xl">📜</Text>
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
                  .filter((c): c is NonNullable<typeof c> => !!c && typeof c === "object")
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