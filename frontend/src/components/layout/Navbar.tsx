"use client";

import React from "react";
import { ButtonFill, ButtonEmpty } from "../ui/Button";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-[#291a17] to-[#1e1b21]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            {/* Brand */}
            <div className="text-white text-xl font-semibold">Freedom Market</div>

            {/* Search (optional placeholder for now) */}
            <div className="flex-1 mx-6 hidden md:block">
                <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 bg-[#3a2f2c] text-white rounded-lg outline-none hover:bg-gray-800"
                />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
                <ButtonEmpty name="Log in" href = "/login" />
                <ButtonFill name="Sign Up!" href = "/signup"/>
            </div>
      </div>
    </nav>
  );
}

