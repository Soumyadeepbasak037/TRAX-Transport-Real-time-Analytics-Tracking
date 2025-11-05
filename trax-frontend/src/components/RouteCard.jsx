// src/components/admin/RouteCard.jsx
export default function RouteCard({ routeId, stops }) {
  return (
    <div className="dark:text-white rounded-xl shadow p-4 border border-gray-200">
      <h2 className="text-lg font-bold mb-2 text-blue-600">
        Route #{routeId}
      </h2>
      <ul className="border-l-2 border-blue-400 pl-4">
        {stops.map((stop) => (
          <li key={stop.stop_order} className="mb-2">
            <span className="font-semibold text-gray-800">
              {stop.stop_order}.
            </span>{" "}
            <span className="text-gray-900">{stop.stop_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
