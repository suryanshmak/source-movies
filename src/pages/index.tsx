import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import { Link, Loading } from "@nextui-org/react";
import { Sidebar } from "@/components/ui/custom/Sidebar";
import { RxCaretLeft, RxCaretRight, RxExternalLink } from "react-icons/rx";
import { MovieCard } from "@/components/ui/custom/MovieCard";
import { SearchResult, SortDirection, SortOption } from "@/static/movieTypes";
import { Meta } from "@/partials/Meta";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";

const parseToType = (a: any, b: any) => {
  if (typeof a === "string") {
    if (Date.parse(a)) {
      return new Date(a).getTime() - new Date(b).getTime();
    } else {
      return a.localeCompare(b);
    }
  } else if (typeof a === "number") {
    return a - b;
  }
  return 0;
};

const getLabelFromValue = (value: number) => {
  const labels = [
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    `${new Date().getFullYear()}`,
  ];
  return labels[value / 20];
};

export default function Home() {
  const [query, dQuery, setQuery] = useDebounce("", 500);
  const [page, dPage, setPage] = useDebounce(1, 250);
  const [autocompleteData, setAutocompleteData] = useState<SearchResult>();
  const [opened, { toggle }] = useDisclosure(false);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(
    new Set(["en"])
  );
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 100]);
  const [genres, setGenres] = useState<number[]>([]);
  const [sortOption, dSortOption, setSortOption] = useDebounce<SortOption>(
    "original_title" as SortOption,
    250
  );
  const [sortDir, dSortDir, setSortDir] = useDebounce<SortDirection>(
    "asc" as SortDirection,
    250
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<SearchResult>();
  const { push, query: q } = useRouter();

  useEffect(() => {
    updateParams();
  }, [sortOption, sortDir, page]);

  useEffect(() => {
    const search = async () => {
      try {
        const req = await fetch(
          q.query
            ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&query=${q.query}&page=${page}&include_adult=${includeAdult}`
            : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}&include_adult=${includeAdult}}`
        );
        const dt = await req.json();
        setData(dt);
      } catch (e) {
        setErrorMessage(String(e));
      }
    };
    search();
  }, [dPage, q.query, includeAdult]);

  useEffect(() => {
    const search = async () => {
      try {
        const req = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&query=${dQuery}&page=${page}&include_adult=${includeAdult}`
        );
        const dt = await req.json();
        setAutocompleteData(dt);
      } catch (e) {
        setErrorMessage(String(e));
      }
    };
    search();
  }, [dQuery, dPage, includeAdult]);

  function updateParams() {
    push({
      pathname: "/",
      query: {
        query,
        page,
        sortOption,
        sortDir,
      },
    });
  }

  if (!data) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Meta
        title={"Home | Finder"}
        description={"Source any movie you want!"}
      />
      <main className="flex flex-row transition-all h-[calc(100vh-3rem)] lg:h-screen lg:mt-0 overflow-hidden">
        <Sidebar
          {...{
            query,
            setQuery,
            updateParams,
            autocompleteData,
            selectedLanguage,
            setSelectedLanguage,
            setIncludeAdult,
            rangeValue,
            setRangeValue,
            setGenres,
            errorMessage,
            opened,
          }}
        />
        {data.results.length ? (
          <div className="flex flex-col w-full gap-y-8 p-[3rem] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-3xl font-semibold">
                {q.query ? `Results for "${q.query}"` : "Discover"}
              </h3>
              <Burger
                opened={opened}
                onClick={toggle}
                className="lg:hidden block z-[999]"
                size={24}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:items-center justify-between w-full">
              <p className="sm:text-lg">
                {q.query
                  ? `${data.total_results} results found`
                  : `Showing ${data.total_results} movies`}
              </p>
              <div className="flex items-center justify-between cursor-pointer">
                <select
                  className="bg-slate-100/50 rounded-md px-2 py-1 border border-gray-200"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="popularity">Relevance</option>
                  <option value="release_date">Year</option>
                  <option value="original_title">Title</option>
                </select>
                <select
                  className="ml-2 bg-slate-100/50 rounded-md px-2 py-1 border border-gray-200"
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value as SortDirection)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.results
                .filter((movie) => {
                  if (genres.length) {
                    return genres.some((genre) =>
                      movie.genre_ids.includes(genre)
                    );
                  }
                  return true;
                })
                .filter((movie) => {
                  if (rangeValue[0] === 0 && rangeValue[1] === 100) {
                    return true;
                  }
                  return (
                    Number(movie.release_date.slice(0, 4)) >=
                      Number(getLabelFromValue(rangeValue[0])) &&
                    Number(movie.release_date.slice(0, 4)) <=
                      Number(getLabelFromValue(rangeValue[1]))
                  );
                })
                .filter((movie) => {
                  return selectedLanguage.has(movie.original_language);
                })
                .sort((a, b) => {
                  if (q.sortDir === "asc") {
                    // @ts-ignore
                    return parseToType(a[q.sortOption], b[q.sortOption]);
                  } else {
                    // @ts-ignore
                    return parseToType(b[q.sortOption], a[q.sortOption]);
                  }
                })
                .map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                className={`${page === 1 ? "opacity-0" : ""}`}
                onClick={() => setPage(page - 1)}
              >
                <RxCaretLeft className="h-7 w-7" />
              </button>
              <p>Page {page}</p>
              <button
                className={`${page === data.total_pages ? "opacity-0" : ""}`}
                onClick={() => setPage(page + 1)}
              >
                <RxCaretRight className="h-7 w-7" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <p className="text-2xl">{!query ? "" : "No Movies Found."}</p>
          </div>
        )}
      </main>
    </>
  );
}
