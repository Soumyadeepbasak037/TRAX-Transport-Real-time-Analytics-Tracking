function ActiveTripsCard({
  trip_id,
  route_id,
  vehicle_id,
  vehicle_number,
  driver_id,
  driver_license,
  driver_name,
  status,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 w-72">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Trip #{trip_id}
      </h3>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Route ID:</span> {route_id}
        </p>
        <p>
          <span className="font-medium text-gray-700">Vehicle:</span> {vehicle_number} (ID: {vehicle_id})
        </p>
        <p>
          <span className="font-medium text-gray-700">Driver:</span> {driver_name} (ID: {driver_id})
        </p>
        <p>
          <span className="font-medium text-gray-700">License:</span> {driver_license}
        </p>
      </div>

      <div
        className={`mt-4 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
          status === "Ongoing"
            ? "bg-green-100 text-green-700"
            : status === "Completed"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

export default ActiveTripsCard;
