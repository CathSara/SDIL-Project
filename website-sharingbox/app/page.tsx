import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center">
      {/* Header Section */}
      <header className="w-full bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-4xl font-extrabold text-center">Sharingbox Köln</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-lg p-12 transform transition duration-500 hover:scale-105 max-w-md w-full text-center">
          <h2 className="text-gray-800 font-bold text-3xl mb-6">Welcome to Sharingbox Köln!</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Sharingbox Köln is your go-to platform for sharing resources and connecting with the community.
            Explore our features and start collaborating today.
          </p>
          <div className="mt-6 flex flex-col space-y-6">
            <Link href="/login">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 w-full">
                Log in
              </button>
            </Link>
            <Link href="/registration">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 w-full">
                Registration
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Sharingbox Köln. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
