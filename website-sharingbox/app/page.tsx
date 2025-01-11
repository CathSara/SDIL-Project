import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center justify-center">
      {/* Header Section */}
      {/*  <header className="w-full bg-mint-green text-dark-green shadow-lg">
        <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-extrabold text-center">Your Smart Giveaway Box</h1>
        </div>
      </header>*/}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-2x1 rounded-lg p-20 transform transition duration-500 hover:scale-105 max-w-lg w-full text-center">
          <h2 className="text-dark-green font-bold text-3xl mb-8">Welcome to your Smart Giveaway Box</h2>
          <p className="text-gray-700 leading-relaxed mb-8 text-lg">
            Discover a new way to give, share, and find treasures in your community! The Give-Away Box is more than just a physical box installed in public spaces—it's a vibrant exchange hub where you can donate items you no longer need and find something useful for yourself.
            <br /><br />
            Visit our website to explore the items available in your local box, like your favorites, and even reserve them for pickup. It's simple, sustainable, and helps reduce waste while fostering a sense of connection in your neighborhood.
            <br /><br />
            Ready to join the movement? Login or register now and start giving, sharing, and finding today!
          </p>
          <div className="mt-6 flex flex-col space-y-6">
            <Link href="/login">
              <button className="bg-gradient-to-r bg-dark-green text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl  hover:bg-dark-green-hover transform transition duration-300 hover:scale-105 w-full">
                Log in
              </button>
            </Link>
            <Link href="/registration">
              <button className="bg-gradient-to-r bg-dark-green text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl  hover:bg-dark-green-hover transform transition duration-300 hover:scale-105 w-full">
                Registration
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Your Smart Giveaway Box. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
