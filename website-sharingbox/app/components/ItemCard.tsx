import Link from "next/link";
import Image from "next/image";

interface Box {
  id: number;
  name: string;
  location: string;
}

interface ItemCardProps {
  item: Item;
  box?: Box;
  userId: string | null;
}

interface Item {
  id: number;
  image_path: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  box_id: number;
  reserved_by_id: number;
}

export default function ItemCard({ item, box, userId }: ItemCardProps) {
  return (
    <Link key={item.id} href={`/inventory/${item.id}`}>
      <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 cursor-pointer">
        {String(item.reserved_by_id) === userId && (
          <div className="absolute top-0 rounded-t-lg left-0 w-full bg-dark-green text-white text-center py-2 font-bold z-50">
            Reserved by yourself
          </div>
        )}
        {String(item.reserved_by_id) !== userId && item.reserved_by_id && (
          <div className="absolute top-0 rounded-t-lg left-0 w-full bg-red-500 text-white text-center py-2 font-bold z-50">
            Reserved by someone else
          </div>
        )}
        <div className="w-full h-64 bg-gray-100 rounded-md mb-4 relative overflow-hidden">
          <Image
            src={item.image_path}
            alt={item.title}
            className="object-cover w-full h-full"
            width="300"
            height="300"
          />
        </div>
        <h2 className="text-gray-800 font-semibold text-xl mb-2">
          {item.title}
        </h2>
        {box && (
          <p className="text-gray-600 text-md">
            <strong>Located in:</strong> {box.name}
          </p>
        )}
      </div>
    </Link>
  );
}
