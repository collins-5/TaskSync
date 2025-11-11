// TeamCard.tsx
import { View, Text, StyleSheet } from "react-native";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge"; // <-- add this if you have a Badge
import { useRouter } from "expo-router";

type Team = {
  id: string;
  name: string;
  members: number;
  color: string;
  initials: string; // e.g. "CO"
};

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();

  return (
    <Card
      className="mb-5 overflow-hidden bg-card rounded-2xl w-[390px]"
      style={styles.cardShadow}
    >
      {/* Colored top stripe */}
      <View className="h-1.5" style={{ backgroundColor: team.color }} />

      <CardHeader className="pb-3">
        <View className="flex-row items-center gap-4">
          {/* Avatar with matching border */}
          <Avatar
            resourceURL=""
            className="w-14 h-14 border-2"
            style={{ borderColor: team.color }}
            first_name={team.initials[0] ?? "?"}
            last_name={team.initials[1] ?? "?"}
            alt={team.name}
          />

          <View className="flex-1">
            <CardTitle className="text-xl text-primary font-semibold">{team.name}</CardTitle>

            {/* Member badge – you can replace with <Badge> if available */}
            <View className="flex-row items-center mt-1">
              <Text className="text-sm text-muted-foreground">
                {team.members} member{team.members !== 1 ? "s" : ""}
              </Text>
              {/* Optional tiny badge */}
              
            </View>
          </View>
        </View>
      </CardHeader>

      <Separator className="mx-4 bg-muted/30" />

      <CardFooter className="pt-3 pb-4">
        <Button
          text="View Team"
          variant="ghost"
          size="sm"
          className="flex-1"
          onPress={() => router.push(`/teams/${team.id}`)}
          accessibilityLabel={`Open ${team.name}`}
        />
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
});
