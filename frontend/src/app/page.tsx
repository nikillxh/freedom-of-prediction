import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import SectionBar from "@/components/layout/SectionBar"
import MarketGrid from "@/components/sections/MarketGrid";

export default function Home() {
  return (
  <div>
    <Navbar />
    <SectionBar />
      <hr className="h-[0.5px] bg-[#413736] border-none"/>
    <MarketGrid />
  </div>);
}
