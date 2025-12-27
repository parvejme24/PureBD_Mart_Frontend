import { API_BASE_URL } from "./api";

export const fetchSettingsServer = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return data?.settings || data;
  } catch (error) {
    console.error("Settings fetch failed:", error);
    return null;
  }
};

