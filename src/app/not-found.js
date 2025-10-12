// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-[#f5f5f5] text-gray-800 p-4">
      
      {/* 404 Header */}
      <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest sm:text-[10rem]">
        404
      </h1>

      {/* Not Found Message */}
      <div className="bg-black text-white px-4 text-sm rounded rotate-12 absolute -translate-y-12 sm:-translate-y-16">
        Page Not Found
      </div>
      
      <p className="mt-5 text-xl sm:text-2xl font-medium text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="mt-8 relative inline-block text-sm font-medium text-indigo-600 group active:text-indigo-500 focus:outline-none focus:ring"
      >
        {/* Animated Background */}
        <span
          className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-indigo-600 group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        {/* Text and Padding */}
        <span className="relative block px-8 py-3 bg-white border border-current transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          Go To Homepage
        </span>
      </Link>
      
    </div>
  );
}