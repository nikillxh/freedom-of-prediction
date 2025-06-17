import Link from "next/link";

interface ButtonProps {
  name: string;
  href?: string;
}

export function ButtonFill({ name, href = "/signup" }: ButtonProps) {
  return (
    <Link
      href={href}
      className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-400 transition duration-200"
    >
      {name}
    </Link>
  );
}

export function ButtonEmpty({ name, href = "/login" }: ButtonProps) {
  return (
    <Link
      href={href}
      className="bg-opacity-0 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
    >
      {name}
    </Link>
  );
}

export function SectionButton( { name }: ButtonProps) {
    return (
        <Link
            href={`/${name.toLowerCase()}`}
            className="text-[#9D8785] hover:opacity-80 transition-colors"
        >
            {name}
        </Link>
    )
}