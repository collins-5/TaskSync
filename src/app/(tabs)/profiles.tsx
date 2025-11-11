// src/app/(tabs)/profiles.tsx
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import supabase from "~/lib/utils/supabase";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Skeleton } from "~/components/ui/skeleton";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import Icon from "~/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import ProfileSkeleton from "~/components/profile/profile-skeleton";
import GetInitials from "~/components/core/get-Initials";
import DrawerDashboardButton from "~/components/core/drawer-dashboard-button";
import ProfileDrawer from "~/components/drawer/drawer";

export default function Profiles() {
  const router = useRouter();
  const { profile, loading, refetch } = useSupabaseData();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (profile && !isEditing) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setEmail(profile.email ?? "");
      setImage(profile.image ?? null);
    }
  }, [profile, isEditing]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to set avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const ext = file.uri.split(".").pop() ?? "jpg";
    const fileName = `${profile!.id}/avatar.${ext}`;

    setSaving(true);
    try {
      const { error: upErr } = await supabase.storage
        .from("profile-images")
        .upload(
          fileName,
          {
            uri: file.uri,
            type: file.mimeType ?? `image/${ext}`,
            name: fileName,
          },
          { upsert: true }
        );

      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      const imgUrl = urlData.publicUrl;
      setImage(imgUrl);

      await supabase
        .from("users")
        .update({ image: imgUrl })
        .eq("id", profile!.id);

      await refetch();
    } catch (e: any) {
      Alert.alert("Upload failed", e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Required", "First and last name are required.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          email,
        })
        .eq("id", profile!.id);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
    } catch (e: any) {
      Alert.alert("Save failed", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  const fullName = `${firstName} ${lastName}`.trim() || "User";

  return (
    <>
        <HeaderSafeAreaView />
        <KeyboardAvoidingWrapper>
          <ScrollView className="flex-1 bg-muted">
            <View className="px-6 pt-10 pb-6">
              {/* AVATAR */}
              <View className="items-center mb-8 ">
                {/*back button */}
                <View className="absolute rounded-full left-1 ">
                  <DrawerDashboardButton
                    setDrawerOpen={setDrawerOpen}
                    className="bg-primary"
                  />
                </View>
                <TouchableOpacity onPress={pickImage} disabled={saving}>
                  {!image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                      contentFit="cover"
                    />
                  ) : (
                    <View className="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <GetInitials firstName={firstName} lastName={lastName} />
                    </View>
                  )}
                </TouchableOpacity>

                <Text className="text-xs font-bold text-foreground mt-4">
                  {profile?.email}
                </Text>

                <Text className="text-2xl font-bold text-foreground mt-2">
                  {fullName}
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Member since {profile?.created_at?.split("T")[0]}
                </Text>
              </View>

              {!isEditing ? (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="flex-row items-center w-1/3 self-end justify-center py-4 border border-teal-600 rounded-lg"
                >
                  <Icon
                    name="account-edit"
                    size={20}
                    className="text-teal-600 mr-2"
                  />
                  <Text className="text-teal-600 font-medium">
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              ) : null}

              <View className="space-y-4">
                {/* First Name */}
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  editable={isEditing}
                  className={isEditing ? "mb-0" : "bg-muted"}
                />

                {/* Last Name */}
                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  editable={isEditing}
                  className={isEditing ? "mb-0" : "bg-muted"}
                />

                {/* Email */}
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  editable={isEditing}
                  className={isEditing ? "mb-0" : "bg-muted"}
                />
              </View>

              <View className="mt-8">
                {isEditing ? (
                  <View className="flex-row justify-around">
                    <Button
                      text="Cancel"
                      variant="outline"
                      size="lg"
                      onPress={() => setIsEditing(false)}
                    />
                    <Button
                      text="Save Changes"
                      size="lg"
                      onPress={handleSave}
                      disabled={saving}
                      loading={saving}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingWrapper>
        <ProfileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
    </>
  );
}
