import { Dashboard } from "@/components/dashboard";
import { StatusBar } from "expo-status-bar";

export default function DashboardScreen() {
  return (
    <>
      <Dashboard />
      <StatusBar style="auto" />
    </>
  );
}