import { View, Text, StyleSheet } from "react-native";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "expo-router";

type Team = {
  id: string;
  name: string;
  members: number;
  color: string;
  initials: string;
};

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();

  return (
    <Card
      className="mb-4 overflow-hidden bg-card rounded-2xl w-[390px]"
      style={styles.cardShadow}
    >
      <View className="h-2" style={{ backgroundColor: team.color }} />
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          <Avatar
            resourceURL=""
            className="w-12 h-12 border-2 border-background"
            first_name={team.initials[0]}
            last_name={team.initials[1]}
            alt={team.name}
          />
          <View className="flex-1">
            <CardTitle className="text-lg">{team.name}</CardTitle>
            <Text className="text-sm text-muted-foreground">
              {team.members} members
            </Text>
          </View>
        </View>
      </CardHeader>
      <Separator className="mx-4 bg-muted/50" />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});
