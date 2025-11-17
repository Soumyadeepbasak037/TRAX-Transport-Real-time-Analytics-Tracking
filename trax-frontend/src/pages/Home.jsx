import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
        {/* Empty left space */}
        <div className="w-1/3"></div>

        {/* Centered Logo */}
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide text-center w-1/3">
          TRAX
        </h1>

        {/* Right Buttons */}
        <div className="w-1/3 flex justify-end space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-24">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Real-Time Bus Tracking Made Simple
        </h2>

        <p className="text-gray-600 text-lg text-center max-w-2xl mb-8">
          Trax helps passengers track buses live, drivers share routes easily,
          and admins manage fleets efficiently — all in one platform.
        </p>

        <div className="flex space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-blue-600 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-md"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
