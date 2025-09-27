import Link from "next/link";

export default function Card({ title, description, link }) {
  return (
    <Link href={link}>
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
