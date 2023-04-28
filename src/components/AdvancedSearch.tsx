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

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!autocompleteRef.current?.contains(e.target)) {
        if (autocompleteRef.current?.children[1]) {
          autocompleteRef.current?.children[1].classList.remove("opacity-100");
          autocompleteRef.current?.children[1].classList.add("opacity-0");
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative flex flex-col">
      <Input
        disableHeading
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Backspace") {
          }
          if (e.key === "Enter") {
            if (autocompleteRef.current?.lastElementChild) {
              autocompleteRef.current?.lastElementChild.classList.remove(
                "opacity-100"
              );
              autocompleteRef.current?.lastElementChild.classList.add(
                "opacity-0"
              );
            }
            updateParams();
          }
        }}
        onFocus={() => {
          if (autocompleteRef.current?.lastElementChild) {
            autocompleteRef.current?.lastElementChild.classList.remove(
              "opacity-0"
            );
            autocompleteRef.current?.lastElementChild.classList.add(
              "opacity-100"
            );
          }
        }}
        prepend={AiOutlineSearch}
        containerClassName="border-light-600"
        className="w-[90%] focus-within:w-full"
        placeholder="Search"
        height="2.8rem"
        value={query}
      />
      <div ref={autocompleteRef}>
        {autocompleteData && autocompleteData.results.length ? (
          <SourcingSearch
            query={query}
            info={autocompleteData?.results
              .slice(0, 6)
              .map((col: any) => [col.poster_path, col.original_title])}
          />
        ) : null}
      </div>
    </div>
  );
};
