"use client"

import React from "react";
import { SectionButton } from "../ui/Button"


export default function SectionBar() {
    return (
        <nav className="w-full px-6 py-4 bg-gradient-to-r from-[#291a17] to-[#1e1b21]">
            
            <div className="max-w-[1440px] mx-auto flex items-center justify-center">
                {/* Sections Buttons */}
                <div className="flex items-center gap-4">
                    <SectionButton name="Sports" />
                    <SectionButton name="Elections"/>
                </div>
            </div>
        </nav>
    )
}