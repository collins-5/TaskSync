import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSessionInit } from "~/components/core/SessionInitializer";
import supabase from "~/lib/utils/supabase";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Skeleton } from "~/components/ui/skeleton";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";

export default function Profiles() {
  const { user, checkAuthState } = useSessionInit();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch profile data
  useEffect(() => {
    if (!user) return;
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
        if (data?.image) console.log("Profile image URL:", data.image);
      } catch (err) {
        setError((err as Error).message || "Failed to load profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle image upload
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSaving(true);
      try {
        const file = result.assets[0];
        const fileExt = file.uri.split(".").pop() || "jpg";
        const fileName = `${user!.id}-${Date.now()}.${fileExt}`;

        // Upload file directly using uri
        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(
            fileName,
            {
              uri: file.uri,
              type: file.mimeType || `image/${fileExt}`,
              name: fileName,
            },
            {
              contentType: file.mimeType || `image/${fileExt}`,
              upsert: true,
            }
          );

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;
        console.log("Uploaded image URL:", imageUrl);
        // Test URL accessibility
        fetch(imageUrl)
          .then((res) => console.log("Image URL fetch status:", res.status))
          .catch((err) => console.error("Image URL fetch error:", err));
        setImage(imageUrl);

        // Update user table with image URL
        const { error: updateError } = await supabase
          .from("users")
          .update({ image: imageUrl })
          .eq("id", user!.id);

        if (updateError) throw updateError;
      } catch (err) {
        setError((err as Error).message || "Failed to upload image");
        console.error("Image upload error:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle profile save
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { error } = await supabase
        .from("users")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user!.id);
      if (error) throw error;
      await checkAuthState();
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to save profile");
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  console.log("Rendering Profiles:", {
    firstName,
    lastName,
    image,
    loading,
    saving,
    error,
  });

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center px-6">
        <Skeleton className="w-32 h-32 mb-6 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full rounded-lg mb-4" />
        <Skeleton className="h-10 w-full rounded-lg mb-4" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-background justify-center px-6">
        <View className="bg-card rounded-2xl shadow-md p-6">
          <Text className="text-2xl font-bold text-foreground mb-4 text-center">
            Your Profile
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            disabled={saving}
            className="items-center mb-6"
          >
            {image ? (
              <Image
                source={{
                  uri: image,
                }}
                className="w-32 h-32 rounded-full"
                contentFit="cover"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                <Text className="text-foreground">Add Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <Input
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            className="mb-4"
            autoCapitalize="words"
          />
          <Input
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            className="mb-4"
            autoCapitalize="words"
          />
          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          )}
          <Button
            text="Save Profile"
            variant="default"
            size="lg"
            onPress={handleSave}
            disabled={saving || !firstName.trim()}
            loading={saving}
          />
          <Button
            text="Back"
            variant="outline"
            size="lg"
            className="mt-4"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
