import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import Markdown from "react-native-markdown-display";
import { Text } from "~/components/ui/text";
import { useAIAssistant } from "~/hooks/useAIAssistant";

export default function AIChat() {
  const router = useRouter();
  const { prompt, setPrompt, response, loading, generate } = useAIAssistant();

  const handleGenerate = () => {
    generate();
    // Clear input after submission
    setTimeout(() => setPrompt(""), 100);
  };

  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        {/* Modern Header */}
        <View className="px-6 bg-primary pt-6 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-4xl font-bold text-slate-900 tracking-tight">
                AI Assistant
              </Text>
              <Text className="text-slate-500 mt-1 text-sm">
                Powered by advanced AI
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center shadow-lg">
              <Text className="text-white text-xl font-bold">✨</Text>
            </View>
          </View>
        </View>

        {/* Chat Container */}
        <View className="flex-1 px-4">
          <ScrollView
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Welcome Message - Show when no response */}
            {!response && !loading && (
              <View className="items-center justify-center py-12">
                <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
                  <Text className="text-4xl">💬</Text>
                </View>
                <Text className="text-xl font-semibold text-slate-800 mb-2">
                  Start a conversation
                </Text>
                <Text className="text-slate-500 text-center px-8">
                  Ask me anything about tasks, team management, or project ideas
                </Text>

                {/* Quick Suggestions */}
                <View className="mt-6 space-y-2 w-full px-4">
                  <TouchableOpacity
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                    onPress={() =>
                      setPrompt(
                        "Suggest creative task ideas for my design team"
                      )
                    }
                  >
                    <Text className="text-slate-700 text-sm">
                      💡 Suggest creative task ideas for my design team
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                    onPress={() =>
                      setPrompt("Help me write a project description")
                    }
                  >
                    <Text className="text-slate-700 text-sm">
                      📝 Help me write a project description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                    onPress={() =>
                      setPrompt("Generate team collaboration strategies")
                    }
                  >
                    <Text className="text-slate-700 text-sm">
                      👥 Generate team collaboration strategies
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* User Message - Show when there's a prompt */}
            {(response || loading) && prompt && (
              <View className="flex-row justify-end mb-4 mt-4">
                <View className="max-w-[80%] bg-primary rounded-3xl rounded-tr-md px-5 py-3 shadow-md">
                  <Text className="text-white text-base leading-6">
                    {prompt}
                  </Text>
                </View>
              </View>
            )}

            {/* Loading State */}
            {loading && (
              <View className="flex-row items-start mb-4">
                <Avatar
                  resourceURL=""
                  className="w-10 h-10 mr-3 border-2 border-muted"
                  first_name="A"
                  last_name="I"
                  alt="AI Assistant"
                />
                <View className="max-w-[75%] bg-white rounded-3xl rounded-tl-md px-5 py-4 shadow-md border border-slate-100">
                  <View className="flex-row items-center space-x-2">
                    <ActivityIndicator size="small" color="#22c55e" />
                    <Text className="text-slate-600 ml-2">
                      AI is thinking...
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* AI Response */}
            {response && !loading && (
              <View className="flex-row items-start mb-4">
                <Avatar
                  resourceURL=""
                  className="w-10 h-10 mr-3 border-2 border-muted"
                  first_name="A"
                  last_name="I"
                  alt="AI Assistant"
                />
                <View className="max-w-[75%] bg-white rounded-3xl rounded-tl-md px-5 py-4 shadow-md border border-slate-100">
                  <Markdown
                    style={{
                      body: {
                        color: "rgb(51,65,85)", // slate-700
                        fontSize: 15,
                        lineHeight: 22,
                      },
                      heading1: {
                        color: "rgb(51,65,85)",
                        fontWeight: "700",
                        fontSize: 20,
                        marginTop: 8,
                        marginBottom: 8,
                      },
                      heading2: {
                        color: "rgb(51,65,85)",
                        fontWeight: "600",
                        fontSize: 18,
                        marginTop: 6,
                        marginBottom: 6,
                      },
                      strong: {
                        fontWeight: "600",
                        color: "rgb(30,41,59)", // slate-800
                      },
                      bullet_list: {
                        color: "rgb(51,65,85)",
                        marginVertical: 4,
                      },
                      list_item: {
                        marginVertical: 2,
                      },
                      code_inline: {
                        backgroundColor: "rgb(241,245,249)", // slate-100
                        padding: 4,
                        borderRadius: 4,
                        color: "rgb(34,197,94)", // primary (green)
                        fontFamily: "monospace",
                      },
                      code_block: {
                        backgroundColor: "rgb(241,245,249)",
                        padding: 12,
                        borderRadius: 8,
                        fontFamily: "monospace",
                      },
                      paragraph: {
                        marginVertical: 4,
                      },
                    }}
                  >
                    {response}
                  </Markdown>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modern Input Area */}
          <View className="bg-white rounded-3xl shadow-2xl border border-slate-200 px-4 py-3 mb-4">
            <View className="flex-row items-end space-x-2">
              <View className="flex-1">
                <Input
                  value={prompt}
                  onChangeText={setPrompt}
                  placeholder="Type your message..."
                  className="rounded-2xl px-4 py-3 bg-muted border-0 text-slate-900"
                  placeholderTextColor="rgb(148,163,184)"
                  multiline
                  maxLength={500}
                  iconProps={{
                    name: "message-outline",
                    size: 20,
                    className: "text-slate-400",
                  }}
                  accessibilityLabel="AI prompt input"
                />
              </View>
              <TouchableOpacity
                onPress={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
                  loading || !prompt.trim() ? "bg-slate-300" : "bg-primary"
                }`}
                accessibilityLabel="Send message"
              >
                <Text className="text-white text-xl">
                  {loading ? "⏳" : "➤"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
