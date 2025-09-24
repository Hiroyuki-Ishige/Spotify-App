import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchInputProps {
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export function SearchInput(props: SearchInputProps) {
  return (
    <section className="mb-10">
      <input
        type="text"
        onChange={props.onInputChange}
        className="bg-gray-700 w-1/3 p-2 rounded-l-lg focus:outline-none"
        placeholder="Search for playlists..."
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
        onClick={() => props.onSearch?.()}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </section>
  );
}
