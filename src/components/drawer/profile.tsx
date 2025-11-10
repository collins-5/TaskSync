// src/components/drawer/ProfileDrawer.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSessionInit } from "~/components/core/SessionInitializer";
import supabase from "~/lib/utils/supabase";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Skeleton } from "~/components/ui/skeleton";
import LogoutButton from "../core/logout-button";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.88;

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { user, checkAuthState } = useSessionInit();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  // Fetch profile
  useEffect(() => {
    if (!user || !isOpen) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, image")
          .eq("id", user.id)
          .single();
        if (
          error &&
          !error.message.includes("column users.image does not exist")
        ) {
          throw error;
        }
        setFirstName(data?.first_name || "");
        setLastName(data?.last_name || "");
        setImage(data?.image || null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, isOpen]);

  // Image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSaving(true);
      try {
        const file = result.assets[0];
        const fileExt = file.uri.split(".").pop() || "jpg";
        const fileName = `${user!.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(
            fileName,
            {
              uri: file.uri,
              type: file.mimeType || `image/${fileExt}`,
              name: fileName,
            },
            { contentType: file.mimeType || `image/${fileExt}`, upsert: true }
          );

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;
        setImage(imageUrl);

        const { error: updateError } = await supabase
          .from("users")
          .update({ image: imageUrl })
          .eq("id", user!.id);

        if (updateError) throw updateError;
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setSaving(false);
      }
    }
  };

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user!.id);
      if (error) throw error;
      await checkAuthState();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{ opacity }}
        className="absolute inset-0 bg-black/60 z-40"
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          { transform: [{ translateX }] },
          { width: DRAWER_WIDTH, height },
        ]}
        className="absolute left-0 top-0 z-50 shadow-2xl"
      >
        <LinearGradient
          colors={["#6366f1", "#8b5cf6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0 opacity-90"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Glass Card */}
          <View className="flex-1 m-4 mt-8 rounded-3xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl">
            {/* Header */}
            <View className="p-6 pb-4">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Edit Profile
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="absolute top-6 right-6 bg-white/20 dark:bg-gray-800/30 rounded-full p-2"
              >
                <Text className="text-white text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="px-6 pb-8">
                <View className="items-center mb-8">
                  <Skeleton className="w-28 h-28 rounded-full ring-4 ring-white/50 shadow-lg" />
                </View>
                <Skeleton className="h-12 w-full rounded-xl mb-4" />
                <Skeleton className="h-12 w-full rounded-xl mb-4" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </View>
            ) : (
              <View className="px-6 pb-8">
                {/* Avatar */}
                <View className="items-center mb-8 -mt-12">
                  <TouchableOpacity
                    onPress={pickImage}
                    disabled={saving}
                    className="relative"
                  >
                    <View className="w-28 h-28 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          className="w-full h-full rounded-full"
                          contentFit="cover"
                        />
                      ) : (
                        <View className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Text className="text-3xl text-gray-500">User</Text>
                        </View>
                      )}
                    </View>
                    <View className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-md">
                      <Text className="text-white text-xs">Edit</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Inputs */}
                <View className="space-y-4">
                  <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    className="bg-gray-50 dark:bg-gray-800 border-0 text-base"
                    autoCapitalize="words"
                  />
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    className="bg-gray-50 dark:bg-gray-800 border-0 text-base"
                    autoCapitalize="words"
                  />
                </View>

                {/* Error */}
                {error ? (
                  <View className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                      {error}
                    </Text>
                  </View>
                ) : null}

                {/* Buttons */}
                <View className="mt-6 space-y-3">
                  <Button
                    text={saving ? "Saving..." : "Save Profile"}
                    variant="default"
                    size="lg"
                    onPress={handleSave}
                    disabled={saving || !firstName.trim()}
                    loading={saving}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  />
                  <Button
                    text="Close"
                    variant="outline"
                    size="lg"
                    onPress={onClose}
                    className="border-gray-300 dark:border-gray-600"
                  />
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
        <LogoutButton />
      </Animated.View>
    </>
  );
}
