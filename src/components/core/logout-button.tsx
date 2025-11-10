// ~/components/auth/LogoutButton.tsx
import { Button } from "~/components/ui/button";
import { useSessionInit } from "./SessionInitializer";

export default function LogoutButton() {
  const { logout, loading } = useSessionInit();

  return (
    <Button
      text={loading ? "Logging out..." : "Log Out"}
      variant="destructive"
      size="default"
      onPress={logout}
      disabled={loading}
      className="w-full text-center"
    />
  );
}
