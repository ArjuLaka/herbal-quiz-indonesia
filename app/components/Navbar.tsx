"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-gray-900 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile */}
        <div className="flex items-center justify-between h-16 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link href="/" className="text-xl font-bold text-blue-400">
              MyApp
            </Link>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            MyApp
          </Link>

          <div className="flex space-x-6 text-white">
            <Link href="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-60 opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        } bg-gray-900 px-4`}
      >
        <div className="flex flex-col py-2 space-y-2 text-white">
          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>

          <hr className="my-2 border-gray-700" />

          <Link href="/login" className="hover:text-blue-400 transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
