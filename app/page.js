"use client";

import Profile from "./components/auth/Profile";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Profile/>

      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to MyApp</h1>
        <p className="text-xl text-gray-600 mb-8">
          Build amazing web applications with Next.js
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </section>

      <section className="grid grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 1</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 2</h2>
          <p className="text-gray-700">
            Sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Feature 3</h2>
          <p className="text-gray-700">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of users who are already using MyApp
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Sign Up Now
        </button>
      </section>
    </div>
  )
}


