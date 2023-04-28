import Link from "next/link";

export const SourcingSearch = ({
  info,
  query,
}: {
  info: any;
  query: string;
}) => {
  const searchQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${searchQ}`, "gi");

  return (
    <div className="absolute top-[50px] z-[9999] flex h-auto w-full flex-col overflow-hidden rounded-xl border border-light-700 bg-white">
      {info.map((n: any, i: number) => {
        const name = String(n[1])
          .replace(pattern, (m: string) => `.<${m}.`)
          .split(".");

        return (
          <Link
            key={i}
            href={`https://www.google.com/search?q=${n[1]}`}
            target="_blank"
          >
            <div className="flex w-full cursor-pointer items-center py-[10px] px-2 gap-x-2 text-black hover:bg-light-700">
              <img
                src={`https://image.tmdb.org/t/p/w500${n[0]}`}
                alt={n[1]}
                className="h-[36px] w-[36px] rounded-full"
              />
              <div className="text-[15px]">
                {name.map((na, idx) => (
                  <p
                    className={`${
                      na.startsWith("<") ? "text-blue-600" : "text-black"
                    } inline`}
                    key={idx}
                  >
                    {na.startsWith(" ") ? `${" "}${na}` : na.replace("<", "")}
                  </p>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
