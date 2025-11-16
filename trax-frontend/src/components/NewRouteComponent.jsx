import { useEffect, useState } from "react";
import API from "../api";

export default function RouteComponent() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await API.get("/routeManagement/allRoutes");
        // use message because backend sends { success, message }
        setData(res.data.message || {});
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="p-10 space-y-24">

      {Object.keys(data).map((routeId) => {
        const stops = data[routeId];
        if (!Array.isArray(stops)) return null;

        return (
          <div key={routeId} className="w-full max-w-6xl mx-auto">
            
            {/* Route Title */}
            <h2 className="text-3xl font-bold text-center mb-12">
              Route {routeId}
            </h2>

            {/* Container for line + dots */}
            <div className="relative w-full">

              {/* Horizontal Line */}
              <div className="absolute top-[28px] left-[5%] right-[5%] h-[3px] bg-gray-300 rounded-full"></div>

              {/* Dots + Names */}
              <div className="flex justify-between items-center px-10">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Dot */}
                    <div className="w-5 h-5 bg-blue-600 rounded-full shadow-md z-10"></div>

                    {/* Stop Name */}
                    <p className="mt-3 text-sm font-medium text-gray-800 w-28 break-words">
                      {stop.stop_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
}
