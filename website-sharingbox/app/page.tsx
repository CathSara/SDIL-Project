export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-4xl font-extrabold text-center">Sharingbox Köln</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="bg-white shadow-2xl rounded-lg p-8 transform transition duration-500 hover:scale-105">
          <h2 className="text-gray-800 font-bold text-2xl mb-4">Welcome to Sharingbox Köln!</h2>
          <p className="text-gray-700 leading-relaxed">
            Sharingbox Köln is your go-to platform for sharing resources and connecting with the community. 
            Explore our features and start collaborating today.
          </p>
          <div className="mt-6">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105">
              Learn More
            </button>
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
