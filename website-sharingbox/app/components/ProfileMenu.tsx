import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProfileMenuProps {
  onReservedClick: () => void;
  onLikedClick: () => void;
  name: string;
  path: string;
  id: string;
}

export default function ProfileMenu({ onReservedClick, onLikedClick, name, path, id }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReservedClick = () => {
    onReservedClick();
    setIsOpen(false);
  };

  const handleLikedClick = () => {
    onLikedClick();
    setIsOpen(false);
  };

  return (
    <div className="relative sm:ml-12">
      <div className="text-black text-sm flex flex-col items-center">
        <Image
          src={path}
          className="rounded-full"
          width={0}
          height={0}
          sizes="3vw"
          style={{ width: "100%", height: "auto" }}
          alt={""}
          onClick={() => setIsOpen(!isOpen)}
        />
        <span>{name}</span>
      </div>
      {/* Overlay Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
          <ul className="py-2">
            <li className="hover:bg-gray-100 cursor-pointer">
              <Link
                href={`/profile/${id}`}
                className="block px-4 py-2 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Profile
              </Link>
            </li>
            <li
              className="hover:bg-gray-100 cursor-pointer block px-4 py-2 flex items-center"
              onClick={handleReservedClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Reserved
            </li>
            <li
              className="hover:bg-gray-100 cursor-pointer block px-4 py-2 flex items-center"
              onClick={handleLikedClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Liked
            </li>
            <li className="hover:bg-gray-100 cursor-pointer">
              <Link href="/" className="block px-4 py-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
