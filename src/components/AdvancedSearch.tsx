import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Input } from "./ui/core/Input";
import { SourcingSearch } from "./SourcingSearch";

export const AdvancedSearch = ({
  query,
  autocompleteData,
  setQuery,
  updateParams,
}: any) => {
  const autocompleteRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex flex-col [&>main]:focus-within:opacity-100 [&>main]:opacity-0"
      ref={autocompleteRef}
    >
      <Input
        disableHeading
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Backspace") {
          }
          if (e.key === "Enter") {
            if (autocompleteRef.current?.children[1]) {
              autocompleteRef.current?.children[1].classList.remove(
                "opacity-100"
              );
              autocompleteRef.current?.children[1].classList.add("opacity-0");
            }
            updateParams();
          }
        }}
        prepend={AiOutlineSearch}
        containerClassName="border-light-600"
        className="w-[90%] focus-within:w-full"
        placeholder="Search"
        height="2.8rem"
        value={query}
      />
      <main>
        {autocompleteData && autocompleteData.results.length ? (
          <SourcingSearch
            query={query}
            info={autocompleteData?.results
              .slice(0, 6)
              .map((col: any) => [col.poster_path, col.original_title])}
          />
        ) : null}
      </main>
    </div>
  );
};
