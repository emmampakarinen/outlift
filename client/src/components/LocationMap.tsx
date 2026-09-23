import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

import { C } from "../shared/colors";
import { useUserLocation } from "../contexts/useContext";
import type { Coordinates, Location } from "../shared/types";
import { useEffect } from "react";

type LocationMapProps = {
  locations?: Location[];
  selectedPosition?: { position: Coordinates; address: string } | null;
  onSelectPosition?: (position: Coordinates, address: string) => void;
  focusPosition?: Coordinates | null;
  interactive?: boolean;
  className?: string;
};

function RecenterMap({ position }: { position: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !position) return;

    map.panTo(position);
  }, [map, position]);

  return null;
}

export function LocationMap({
  locations = [],
  selectedPosition = null,
  onSelectPosition,
  focusPosition = null,
  interactive = true,
  className = "h-full w-full",
}: LocationMapProps) {
  const { userLocation } = useUserLocation();

  const fallbackCenter: Coordinates = focusPosition ??
    userLocation ?? {
      lat: 60.1699,
      lng: 24.9384,
    };

  async function handleMapClick(position: Coordinates) {
    if (!onSelectPosition) return;

    try {
      const geocoder = new google.maps.Geocoder();

      const response = await geocoder.geocode({
        location: position,
      });

      const address = response.results[0]?.formatted_address ?? "";

      onSelectPosition(position, address);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

      onSelectPosition(position, "");
    }
  }

  return (
    <Map
      defaultCenter={fallbackCenter}
      defaultZoom={14}
      mapId="DEMO_MAP_ID"
      disableDefaultUI
      gestureHandling={interactive ? "auto" : "none"}
      className={className}
      onClick={
        interactive && onSelectPosition
          ? (event) => {
              const position = event.detail.latLng;

              if (!position) return;

              handleMapClick({
                lat: position.lat,
                lng: position.lng,
              });
            }
          : undefined
      }
    >
      <RecenterMap
        position={selectedPosition?.position ?? focusPosition ?? null}
      />

      {userLocation && interactive && (
        <AdvancedMarker position={userLocation} title="Your location">
          <div
            className="h-4 w-4 rounded-full border-2 border-white shadow-md"
            style={{
              background: "#2563eb",
            }}
          />
        </AdvancedMarker>
      )}

      {locations.map((location) => (
        <AdvancedMarker
          key={location.id}
          position={{
            lat: Number(location.latitude),
            lng: Number(location.longitude),
          }}
          title={location.name}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full shadow-md"
            style={{
              background: C.forest,
              color: "white",
              border: "2px solid white",
            }}
          >
            <MapPin size={18} />
          </div>
        </AdvancedMarker>
      ))}

      {selectedPosition && (
        <AdvancedMarker
          position={selectedPosition.position}
          title="New training spot"
        />
      )}
    </Map>
  );
}
