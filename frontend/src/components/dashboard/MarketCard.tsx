import Image from "next/image";
import { Bookmark } from "lucide-react";
import { MarketMeta } from "@/types/market";

export function MarketCard({
  name,
  image,
  yesPercent,
  noPercent,
  volume,
}: MarketMeta) {
  return (
    <div className="bg-[#3c2f2d] text-white p-4 rounded-2xl w-80 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center text-black font-bold">
          {image.startsWith("http") ? (
            <Image src={image} alt="icon" width={32} height={32} />
          ) : (
            <span className="text-lg">{image}</span>
          )}
        </div>
        <p className="text-sm font-medium leading-snug">{name}</p>
      </div>

      {/* Yes/No Buttons & Percentages */}
      <div className="bg-[#453532] rounded-xl p-4 flex justify-between items-center text-center">
        <div>
          <div className="bg-[#264d46] text-green-400 font-semibold px-4 py-1 rounded-md">
            Yes
          </div>
          <div className="mt-1 text-white font-medium">{yesPercent}%</div>
        </div>
        <div>
          <div className="bg-[#5a2d2d] text-red-400 font-semibold px-4 py-1 rounded-md">
            No
          </div>
          <div className="mt-1 text-white font-medium">{noPercent}%</div>
        </div>
      </div>

      {/* Volume & Bookmark */}
      <div className="bg-[#453532] rounded-xl px-4 py-2 flex justify-between items-center">
        <div className="text-sm text-white">
          <span className="text-gray-400">Vol</span> &nbsp; {volume}
        </div>
        <Bookmark size={18} strokeWidth={1.5} className="text-white" />
      </div>
    </div>
  );
}
