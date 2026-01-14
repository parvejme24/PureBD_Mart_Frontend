import { API_BASE_URL } from "./api";

export const fetchSettingsServer = async () => {
  // During build time or in environments where API is not available, return null immediately
  if (typeof window === 'undefined' && !API_BASE_URL?.includes('vercel.app')) {
    // Skip API calls during static generation
    return null;
  }

  try {
    // Add a timeout to prevent hanging during SSR
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const res = await fetch(`${API_BASE_URL}/settings`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        // Settings endpoint not implemented - this is expected
        return null;
      }
      // For other errors during SSR, don't throw - just return null
      if (typeof window === 'undefined') {
        return null;
      }
      throw new Error(`Settings API returned ${res.status}`);
    }

    const data = await res.json();
    return data?.settings || data;
  } catch (error) {
    // During SSR, don't log errors - just return null
    if (typeof window === 'undefined') {
      return null;
    }

    // Only log in browser environment
    if (error.name !== 'AbortError') {
      console.warn("Settings fetch failed (non-critical):", error.message);
    }
    return null;
  }
};

