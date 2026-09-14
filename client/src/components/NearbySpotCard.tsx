import { Link } from "react-router-dom";

type NearbySpotCardProps = {
  id: number;
  name: string;
  description: string;
};

export function NearbySpotCard({ id, name, description }: NearbySpotCardProps) {
  return (
    <Link
      to={`/locations/${id}`}
      className="min-w-40 rounded-full bg-[#1a4332] px-5 py-2.5 text-left text-[#f3f8f5] shadow-sm transition hover:opacity-90"
    >
      <h3 className="text-sm font-semibold">{name}</h3>
      <p className="text-xs text-[#d8e7df]">{description}</p>
    </Link>
  );
}
