import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

import { C } from "../shared/colors";
import { MapPin } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { lat: number; lng: number; address: string }) => void;
};

export function AddressAutocomplete({ value, onChange, onPlaceSelect }: Props) {
  const places = useMapsLibrary("places");

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!places) return;

    sessionTokenRef.current = new places.AutocompleteSessionToken();
  }, [places]);

  useEffect(() => {
    if (!places || !value.trim() || !sessionTokenRef.current) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const { suggestions } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          sessionToken: sessionTokenRef.current!,
          includedRegionCodes: ["fi"],
        });

      setSuggestions(suggestions.slice(0, 4));
    }, 250);

    return () => clearTimeout(timeout);
  }, [value, places]);

  async function handleSelect(
    suggestion: google.maps.places.AutocompleteSuggestion,
  ) {
    const prediction = suggestion.placePrediction;

    if (!prediction) return;

    const place = prediction.toPlace();

    await place.fetchFields({
      fields: ["formattedAddress", "location"],
    });

    if (!place.location) return;

    const address = place.formattedAddress ?? prediction.text.toString();

    onChange(address);

    onPlaceSelect({
      lat: place.location.lat(),
      lng: place.location.lng(),
      address,
    });

    setSuggestions([]);

    if (places) {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    }
  }

  return (
    <div className="relative">
      <MapPin
        size={16}
        className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2"
        style={{ color: C.textFaint }}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter address or place name"
        className="w-full rounded-2xl py-3 pr-4 pl-10 text-sm outline-none"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          color: C.text,
        }}
      />

      {suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl shadow-lg"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;

            if (!prediction) return null;

            return (
              <button
                key={`${prediction.placeId}-${index}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="block w-full px-4 py-3 text-left text-sm"
                style={{
                  color: C.text,
                  borderBottom:
                    index < suggestions.length - 1
                      ? `1px solid ${C.border}`
                      : undefined,
                }}
              >
                {prediction.text.toString()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
