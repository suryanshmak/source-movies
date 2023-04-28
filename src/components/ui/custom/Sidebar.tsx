import { AdvancedSearch } from "@/components/AdvancedSearch";
import { Checkbox, Dropdown, Switch } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { Alert, RangeSlider } from "@mantine/core";
import { movieGenres, movieLanguages } from "@/static/movieData";

export const marks = [
  { value: 0, label: "1970" },
  { value: 20, label: "1980" },
  { value: 40, label: "1990" },
  { value: 60, label: "2000" },
  { value: 80, label: "2010" },
  { value: 100, label: `${new Date().getFullYear()}` },
];

export const Sidebar = (props: any) => {
  const selectedValue = React.useMemo(() => {
    const languages = Array.from(props.selectedLanguage)
      .join(", ")
      .replaceAll("_", " ");
    const fullLanguages: any = [];
    languages.split(", ").forEach((lang) => {
      fullLanguages.push(movieLanguages[lang as keyof typeof movieLanguages]);
    });
    return fullLanguages.join(", ");
  }, [props.selectedLanguage]);

  return (
    <div
      className={`bg-slate-100 border-r border-zinc-500/10 border-inset transition-all gap-y-6 h-screen flex-col p-[2rem] ${
        props.opened
          ? "md:w-1/2 z-10 absolute top-0 left-0 w-screen lg:relative lg:z-0"
          : "hidden"
      } lg:w-[24rem] xl:w-[28rem] flex lg:flex overflow-y-auto`}
    >
      <Link href="/" className="text-2xl font-semibold">
        Home
      </Link>
      <AdvancedSearch {...props} />
      <div className="flex flex-col gap-y-5">
        {props.errorMessage.length ? (
          <Alert title="Bummer!" color="red" className="h-auto">
            Error Fetching Data. Check the console for more info.
          </Alert>
        ) : null}
        <h4 className="text-lg font-semibold">Filters</h4>
        <div className="h-[1px] bg-zinc-600/10 my-1" />
        <div className="flex flex-col gap-y-4">
          <h5 className="font-semibold">Genres</h5>
          <div className="grid gap-4 grid-cols-2">
            {Object.keys(movieGenres).map((genre, idx) => (
              <Genre
                key={idx}
                setGenres={props.setGenres}
                genre={{
                  id: movieGenres[genre as keyof typeof movieGenres],
                  name: genre,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-4 ">
          <h5 className="font-semibold">Languages</h5>
          <Dropdown>
            <Dropdown.Button
              flat
              color="primary"
              className="bg-[#0072F5] bg-opacity-20 h-10"
            >
              {selectedValue.slice(0, 25)}...
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={props.selectedLanguage}
              onSelectionChange={props.setSelectedLanguage}
            >
              {Object.keys(movieLanguages).map((lang) => (
                <Dropdown.Item key={lang.toLowerCase()}>
                  {movieLanguages[lang as keyof typeof movieLanguages]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="flex flex-col gap-y-4">
          <h5 className="font-semibold">Rated</h5>
          <div className="flex items-center gap-x-2">
            <p>U / A</p>
            <Switch
              size="sm"
              onChange={(e) => props.setIncludeAdult(e.target.checked)}
            />
            <p>A</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 pb-4">
          <h5 className="font-semibold">Year released</h5>
          <div className="flex items-center gap-x-2">
            <RangeSlider
              defaultValue={[0, 100]}
              className="w-full"
              step={20}
              value={props.rangeValue}
              onChange={props.setRangeValue}
              marks={marks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Genre = ({ genre, setGenres }: any) => {
  return (
    <Checkbox
      value={genre.id}
      size="md"
      className="[&>span]:text-base"
      onChange={(e) =>
        e
          ? setGenres((prev: number[]) => [...prev, genre.id])
          : setGenres((prev: number[]) =>
              prev.filter((id: any) => id !== genre.id)
            )
      }
    >
      {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
    </Checkbox>
  );
};
