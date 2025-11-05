// src/components/admin/RouteList.jsx
import RouteCard from "./RouteCard.jsx";

export default function RouteList({ groupedRoutes }) {
  const routeIds = Object.keys(groupedRoutes);

  if (routeIds.length === 0) {
    return <p className="text-gray-500">Loading routes...</p>;
  }

  return (
    <div className="dark:space-y-6">
      {routeIds.map((id) => (
        <RouteCard key={id} routeId={id} stops={groupedRoutes[id]} />
      ))}
    </div>
  );
}
