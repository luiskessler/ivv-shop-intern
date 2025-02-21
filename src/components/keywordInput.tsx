import React, { useState } from "react";
import { X } from "lucide-react";

interface KeywordsInputProps {
  initialKeywords?: string[];
  onKeywordsChange: (keywords: string[]) => void;
  unique: boolean;
  placeholder: string;
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({
  initialKeywords = [],
  onKeywordsChange,
  unique = false,
  placeholder,
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputValue, setInputValue] = useState<string>("");

  // Handles adding new keyword on Enter or comma press, and keyword removal on Backspace
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault();
      const newKeywords = unique
        ? [...new Set([...keywords, inputValue.trim()])]
        : [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue("");
    } else if (event.key === "Backspace" && inputValue === "") {
      event.preventDefault();
      const newKeywords = keywords.slice(0, -1);
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
    }
  };

  // Handles pasting keywords separated by commas, new lines, or tabs
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const paste = event.clipboardData.getData("text");
    const keywordsToAdd = paste
      .split(/[\n\t,]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    if (keywordsToAdd.length) {
      const newKeywords = unique
        ? [...new Set([...keywords, ...keywordsToAdd])]
        : [...keywords, ...keywordsToAdd];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== "" && event.relatedTarget?.tagName !== "BUTTON") {
      const newKeywords = unique
        ? [...new Set([...keywords, inputValue.trim()])]
        : [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove);
    setKeywords(newKeywords);
    onKeywordsChange(newKeywords);
  };

  return (
    <div className="flex w-full flex-wrap items-center rounded-lg border bg-white shadow-md">
      <div className="flex-no-wrap flex min-h-10 w-full overflow-x-scroll py-1">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => removeKeyword(index)}
            className={`mx-[2px] my-auto flex h-[80%] items-center rounded-md bg-[#F4F4F5] p-2 text-base text-black ${index === 0 && "ml-1"}`}
          >
            {keyword}
            <X size={14} className="ml-2 cursor-pointer" />
          </button>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          className="m-1 mx-1 flex-1 outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default KeywordsInput;
