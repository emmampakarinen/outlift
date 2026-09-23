import { useLocation, useNavigate } from "react-router-dom";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const history: string[] = location.state?.history ?? [];
  function goTo(path: string, extraState = {}) {
    navigate(path, {
      state: {
        ...extraState,
        history: [...history, location.pathname],
      },
    });
  }

  function goBack(extraState = {}, fallback = "/home") {
    const backTo = history.at(-1) ?? fallback;
    const remainingHistory = history.slice(0, -1);

    navigate(backTo, {
      state: {
        ...extraState,
        history: remainingHistory,
      },
    });
  }

  return {
    goTo,
    goBack,
  };
}

export function useReverseGeocode() {
  const geocoding = useMapsLibrary("geocoding");

  async function reverseGeocode(position: { lat: number; lng: number }) {
    if (!geocoding) return null;

    const geocoder = new geocoding.Geocoder();

    const response = await geocoder.geocode({
      location: position,
    });

    return response.results[0]?.formatted_address ?? null;
  }

  return reverseGeocode;
}
