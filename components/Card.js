import Link from "next/link";

export default function Card({ title, description, link }) {
  return (
    <Link href={link}>
      <div className="bg-purple-900 shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-white">{description}</p>
      </div>
    </Link>
  );
}
