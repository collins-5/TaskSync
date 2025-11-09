// src/linking.ts
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useDeepLinking() {
    const router = useRouter();

    useEffect(() => {
        const handle = (url: string) => {
            if (!url) return;

            const path = url
                .replace(/^tasksync:\/\//, "")
                .replace(/^exp\+tasksync:\/\//, "")
                .replace(/^\/+/, "");

            if (path.startsWith("records/patient/")) {
                const id = path.split("/").pop();
                router.replace(`/records/patient/${id}`);
            } else {
                router.replace("/");
            }
        };

        const sub = Linking.addEventListener("url", (e) => handle(e.url));
        Linking.getInitialURL().then((url) => url && handle(url));

        return () => sub.remove();
    }, [router]);
}