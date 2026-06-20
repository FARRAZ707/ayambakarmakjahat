import { DataLogger } from "@/components/data-logger";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();

  return <DataLogger onBackPress={() => router.back()} />;
}
