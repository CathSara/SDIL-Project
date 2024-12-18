import React from 'react';
import Image from 'next/image';

interface Item {
  id: number;
  image_path: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  is_taken: boolean;
}


export default async function Page() {
  const data = await fetch('http://127.0.0.1:5000/inventory/items');
  const items: Item[] = await data.json();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-10 py-16">
          <h1 className="text-5xl font-extrabold text-center">Sharing Box Köln!</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-2xl rounded-lg p-6 transform transition duration-500 hover:scale-105"
          >
            <Image
              src={item.image_path}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md mb-4"
              width="300"
              height="300"
            />
            <h2 className="text-gray-800 font-bold text-2xl mb-2">{item.title}</h2>
            <p className="text-gray-600 text-lg">{item.description}</p>
            <p className="text-gray-500 text-sm mt-2">
              <strong>Category:</strong> {item.category}
            </p>
            <p className="text-gray-500 text-sm">
              <strong>Condition:</strong> {item.condition}
            </p>
            <p className={`text-sm mt-4 ${item.is_taken ? 'text-red-500' : 'text-green-500'}`}>
              {item.is_taken ? 'Taken' : 'Available'}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
