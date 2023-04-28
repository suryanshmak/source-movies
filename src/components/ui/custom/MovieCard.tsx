import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { RxExternalLink } from "react-icons/rx";

export const MovieCard = ({ movie }: any) => {
  return (
    <Link
      href={`https://www.google.com/search?q=${movie.original_title}`}
      target="_blank"
    >
      <div
        key={movie.id}
        className="bg-zinc-100 relative w-auto h-auto md:p-0 rounded-xl flex flex-col items-center transition-all ring-1 ring-zinc-500/10 ring-inset cursor-pointer overflow-hidden [&>div]:hover:opacity-100"
      >
        <img
          className="w-full h-auto"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
          }
          alt={movie.title}
        />
        <div className="absolute top-2 left-2 flex items-center gap-x-1 bg-black rounded-full text-[15px] text-white px-2 py-[2px]">
          <AiFillStar className="text-yellow-400" />
          <p>{Math.round(movie.popularity)}</p>
        </div>
        <div className="absolute bottom-0 bg-black bg-opacity-20 md:opacity-0 transition-all duration-500 w-full">
          <div
            className={`flex flex-col p-4 ${
              movie.overview.length > 0 ? "h-32" : "h-16"
            } text-white`}
          >
            <p className="text-lg font-bold leading-6">{movie.title}</p>
            <p className="text-md">
              {movie.overview.length > 0
                ? `${movie.overview.slice(0, 60)}...`
                : ""}
            </p>
          </div>
          <div className=" text-blue-500">
            <p className="px-4 pb-4 flex items-center gap-x-2">
              View More
              <RxExternalLink />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
