import Image from "next/image";
import Link from "next/link";
import AuthorizedRoute from "@/components/AuthorizedRoute";

export default function GamesIndex() {
  const games = [
    {
      name: "Sample Game",
      icon: "/icons/Star.svg",
      href: "/games/sample",
    },
  ];

  return (
    <AuthorizedRoute>
      <div
        className="min-h-screen bg-no-repeat px-6 py-8 tablet:px-10 tablet:py-10"
        style={{
          backgroundImage: 'url("/bg-home.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <h1 className="mb-8 font-quantico text-4xl text-icanBlue-300">Games</h1>
        <ul className="flex flex-wrap gap-6">
          {games.map((game) => (
            <li key={game.href}>
              <Link
                href={game.href}
                className="group flex flex-col items-center"
              >
                <div className="relative h-[6rem] w-[6rem] desktop:h-[7rem] desktop:w-[7rem]">
                  <Image
                    src="/misc/NavButton.svg"
                    alt=""
                    fill
                    className="pointer-events-none object-fill"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pb-2">
                    <Image
                      src={game.icon}
                      alt={game.name}
                      width={56}
                      height={56}
                      className="h-[58%] w-[58%] object-contain"
                    />
                  </div>
                </div>
                <p className="mt-1 font-quantico text-lg text-white transition group-hover:opacity-80">
                  {game.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AuthorizedRoute>
  );
}
