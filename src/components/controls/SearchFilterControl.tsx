import { useEffect, useState } from "react";

import { useDebounce } from "~/utils";

import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Close from "@mui/icons-material/Close";

import type { InputProps } from "@mui/material/Input";
import type { ValueAndSetter, WithOverrides } from "~/utils";

//================================================

export type SearchFilterControlProps = WithOverrides<InputProps, ValueAndSetter<"value", string>>;

export function SearchFilterControl({ value, setValue, ...props }: SearchFilterControlProps) {
  const [text, setText] = useState(value);

  const setValueDebounced = useDebounce(setValue, 800);
  useEffect(() => {
    setValueDebounced(text);
    return () => setValueDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  useEffect(() => {
    setText(value);
    return () => setValueDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      type="search"
      {...props}
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === "Enter") {
          setValueDebounced.cancel();
          setValue(text);
        }
      }}
      endAdornment={
        text ? (
          <IconButton size="small" onClick={() => setText("")}>
            <Close />
          </IconButton>
        ) : undefined
      }
    />
  );
}
