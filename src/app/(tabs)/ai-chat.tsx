import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import Markdown from "react-native-markdown-display";
import { Text } from "~/components/ui/text";
import { useAIAssistant } from "~/hooks/useAIAssistant";
import { useSessionInit } from "~/components/core/SessionInitializer";
import supabase from "~/lib/utils/supabase";
import { useRef, useState, useEffect } from "react";
import Icon from "~/components/ui/icon";
import { useSupabaseData } from "~/hooks/useSupabaseData";

const { width } = Dimensions.get("window");

// === Skeleton Message Component ===
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

export default function AIChat() {
  const router = useRouter();
  const {
    prompt,
    setPrompt,
    response,
    loading: aiLoading,
    generate,
  } = useAIAssistant();

  const {
    profile,
    teams,
    tasks,
    chatHistory,
    loading: dataLoading,
    error: dataError,
  } = useSupabaseData();

  const { user } = useSessionInit();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastSentPrompt, setLastSentPrompt] = useState("");
  const sidebarAnim = useRef(new Animated.Value(-300)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Build conversation safely - sort by created_at ascending (oldest first)
  const conversation = Array.isArray(chatHistory)
    ? chatHistory
        .map((entry: any) => ({
          prompt: entry.prompt ?? "",
          response: entry.response ?? "",
          created_at: entry.created_at,
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
    : [];

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [conversation.length, response, aiLoading]);

  // Save chat after AI responds
  useEffect(() => {
    if (response && lastSentPrompt && !aiLoading && user) {
      // Don't save if the response is an API error
      const isAPIError =
        response.includes("API error:") ||
        response.includes("503") ||
        response.includes("500");

      if (isAPIError) {
        // Just clear the states without saving
        setLastSentPrompt("");
        return;
      }

      const saveChat = async () => {
        try {
          await supabase.from("chat_history").insert({
            user_id: user.id,
            prompt: lastSentPrompt,
            response,
          });
          setLastSentPrompt(""); // Clear after saving
          setPrompt(""); // Clear the input
        } catch (err) {
          console.error("Failed to save chat:", err);
        }
      };
      saveChat();
    }
  }, [response, aiLoading, lastSentPrompt, user]);

  const toggleSidebar = () => {
    Animated.spring(sidebarAnim, {
      toValue: isSidebarOpen ? -300 : 0,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || aiLoading || dataLoading) return;
    setLastSentPrompt(prompt); // Save the prompt before generating
    await generate();
  };

  const renderChatHistoryItem = ({ item }: any) => (
    <TouchableOpacity
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
    </TouchableOpacity>
  );

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

        {/* Main Content */}
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
                    {profile
                      ? `Hey ${profile.first_name}! `
                      : "Powered by AI Magic"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* CHAT AREA */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
            scrollEnabled={!isSidebarOpen}
            onContentSizeChange={() => {
              // Auto-scroll to bottom when new messages appear
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          >
            {/* LOADING STATE FOR MESSAGES */}
            {dataLoading && (
              <View>
                <MessageSkeleton isUser={false} />
                <MessageSkeleton isUser={true} />
                <MessageSkeleton isUser={false} />
                <MessageSkeleton isUser={true} />
              </View>
            )}

            {/* Welcome */}
            {!dataLoading &&
              conversation.length === 0 &&
              !prompt &&
              !response &&
              !aiLoading && (
                <View className="items-center justify-center py-16">
                  <View className="w-24 h-24 rounded-3xl bg-primary/20 items-center justify-center mb-6 border border-border">
                    <Text className="text-5xl">Chat</Text>
                  </View>
                  <Text className="text-2xl font-bold text-foreground mb-2">
                    Let's Create Something
                  </Text>
                  <Text className="text-muted-foreground text-center px-8 mb-8">
                    Ask me anything about your tasks, teams, or projects
                  </Text>

                  <View className="w-full space-y-3 px-2">
                    {[
                      {
                        icon: "Lightbulb",
                        text: "Suggest creative task ideas",
                        prompt:
                          "Suggest creative task ideas for my design team",
                      },
                      {
                        icon: "Pencil",
                        text: "Write a project description",
                        prompt: "Help me write a project description",
                      },
                      {
                        icon: "People",
                        text: "Team collaboration tips",
                        prompt: "Generate team collaboration strategies",
                      },
                    ].map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        className="bg-muted p-4 rounded-2xl border border-border active:bg-muted/80"
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

            {/* Error */}
            {dataError && !dataLoading && (
              <View className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 my-4">
                <Text className="text-red-600 text-center">{dataError}</Text>
              </View>
            )}

            {/* PAST MESSAGES */}
            {!dataLoading &&
              conversation.map((msg, idx) => (
                <View key={idx}>
                  <View className="flex-row justify-end mb-4">
                    <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md px-5 py-3 shadow-lg">
                      <Text className="text-primary-foreground text-base leading-6">
                        {msg.prompt}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start mb-4">
                    <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3 border border-border">
                      <Text className="text-lg">AI</Text>
                    </View>
                    <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border border-border">
                      <Markdown
                        style={{
                          body: {
                            color: "inherit",
                            fontSize: 15,
                            lineHeight: 22,
                          },
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

            {/* CURRENT USER MESSAGE */}
            {lastSentPrompt && !response && !aiLoading && (
              <View className="flex-row justify-end mb-4">
                <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md px-5 py-3 shadow-lg">
                  <Text className="text-primary-foreground text-base leading-6">
                    {lastSentPrompt}
                  </Text>
                </View>
              </View>
            )}

            {/* AI LOADING */}
            {aiLoading && (
              <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3 border border-border">
                  <Text className="text-lg">AI</Text>
                </View>
                <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border border-border">
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#22c55e" />
                    <Text className="text-foreground ml-3">Thinking...</Text>
                  </View>
                </View>
              </View>
            )}

            {/* LIVE AI RESPONSE */}
            {response && !aiLoading && (
              <View className="flex-row items-start mb-4">
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3 border border-border">
                  <Text className="text-lg">AI</Text>
                </View>
                <View
                  className={`max-w-[75%] rounded-3xl rounded-tl-md px-5 py-4 shadow-lg border ${
                    response.includes("API error:")
                      ? "bg-red-500/10 border-red-500/50"
                      : "bg-muted border-border"
                  }`}
                >
                  {response.includes("API error:") ? (
                    <View>
                      <Text className="text-red-600 font-semibold mb-2">
                        ⚠️ Service Temporarily Unavailable
                      </Text>
                      <Text className="text-red-600/80 text-sm">
                        The AI service is currently experiencing issues. Please
                        try again in a moment.
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setPrompt(lastSentPrompt);
                          setLastSentPrompt("");
                        }}
                        className="mt-3 bg-red-500/20 px-4 py-2 rounded-xl"
                      >
                        <Text className="text-red-600 text-center font-medium">
                          Try Again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Markdown
                      style={{
                        body: {
                          color: "inherit",
                          fontSize: 15,
                          lineHeight: 22,
                        },
                        paragraph: { marginVertical: 4 },
                        strong: { fontWeight: "600" },
                      }}
                    >
                      {response}
                    </Markdown>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* INPUT BAR */}
          <View className="px-4 pb-4 bg-background">
            <View className="bg-muted rounded-3xl shadow-2xl border border-border px-4 py-3">
              <View className="flex-row items-end space-x-3">
                <View className="flex-1">
                  <Input
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="Type your message..."
                    className="rounded-2xl px-4 py-3 bg-background border-border"
                    placeholderTextColor="rgb(148,163,184)"
                    multiline
                    maxLength={500}
                    editable={!isSidebarOpen && !dataLoading}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleGenerate}
                  disabled={
                    aiLoading || dataLoading || !prompt.trim() || isSidebarOpen
                  }
                  className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
                    aiLoading || dataLoading || !prompt.trim() || isSidebarOpen
                      ? "bg-muted"
                      : "bg-primary"
                  }`}
                >
                  <Icon
                    name={aiLoading ? "hourglass" : "send"}
                    size={20}
                    className={
                      aiLoading ||
                      dataLoading ||
                      !prompt.trim() ||
                      isSidebarOpen
                        ? "text-muted-foreground"
                        : "text-primary-foreground"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* SIDEBAR */}
        <Animated.View
          className="absolute top-0 left-0 h-fit w-[300px] bg-background shadow-2xl z-20 border-r border-border"
          style={{ transform: [{ translateX: sidebarAnim }] }}
          pointerEvents={isSidebarOpen ? "auto" : "none"}
        >
          <View className="pt-12 px-4 pb-4 bg-primary/10">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Text className="text-2xl">Chat</Text>
                </View>
                <Text className="text-xl font-bold text-foreground">
                  Dashboard
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleSidebar}
                className="p-2 rounded-full bg-muted"
              >
                <Icon name="close" size={20} className="text-foreground" />
              </TouchableOpacity>
            </View>
            <Text className="text-muted-foreground text-xs ml-13">
              {profile?.first_name || "User"}'s Workspace
            </Text>
          </View>

          <View className="flex-1">
            <View className="px-4 py-3 bg-muted/50">
              <Text className="text-foreground font-semibold text-sm">
                Chat History (Recent First)
              </Text>
            </View>
            {dataLoading ? (
              <View className="px-4 py-8">
                <Text className="text-muted-foreground text-center text-sm">
                  Loading history...
                </Text>
              </View>
            ) : Array.isArray(chatHistory) && chatHistory.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {[...chatHistory]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((item: any) => renderChatHistoryItem({ item }))}
              </ScrollView>
            ) : (
              <View className="items-center justify-center py-8 px-4">
                <Text className="text-muted-foreground text-center text-sm">
                  No chat history yet
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
