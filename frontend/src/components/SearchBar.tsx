"use client";

import { ChangeEvent } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

export function SearchBar() {
  const { query, setQuery } = useSearch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <TextField
      placeholder="Buscar clientes, leads..."
      size="small"
      fullWidth
      value={query}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={16} />
          </InputAdornment>
        ),
        inputProps: {
          "aria-label": "Buscar por nome, e-mail ou telefone",
        },
      }}
    />
  );
}
