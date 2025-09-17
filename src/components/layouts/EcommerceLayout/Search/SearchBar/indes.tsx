"use client";

import { Dispatch, SetStateAction } from "react";
import Icon from "@/components/elements/Icon";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2 w-full border border-grayscale-100 rounded-lg p-4 outline-none justify-between mb-8">
      <input
        type="text"
        placeholder="o que você está buscando?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none w-full placeholder-grayscale-300 text-sm"
      />
      <span className="px-3">
        <Icon name="CiSearch" color="#272934" size={16} />
      </span>
    </div>
  );
}
