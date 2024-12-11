export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-center">Sharingbox Köln</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Sharingbox Köln!</h2>
          <p className="text-gray-700 leading-relaxed">
            Sharingbox Köln is your go-to platform for sharing resources and connecting with the community. 
            Explore our features and start collaborating today.
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Sharingbox Köln. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
