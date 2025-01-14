import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-mint-green flex flex-col items-center justify-center">

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-2x1 rounded-lg p-5 transform transition duration-500 hover:scale-105 max-w-lg w-full text-center mt-5 mx-2">
          <h2 className="text-dark-green font-bold text-3xl mb-8">Welcome to your Smart Giveaway Box</h2>
          <p className="text-gray-700 leading-relaxed mb-8 text-lg">
            Discover a new way to give, share, and find treasures in your community! The Give-Away Box is more than just a physical box installed in public spaces — it&apos;s a vibrant exchange hub where you can donate items you no longer need and find something useful for yourself.
            <br /><br />
            Visit our website to explore the items available in your local box, like your favorites, and even reserve them for pickup. It&apos;s simple, sustainable, and helps reduce waste while fostering a sense of connection in your neighborhood.
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
      <Footer></Footer>
    </div>
  );
}
