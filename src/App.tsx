import "./App.css";
import { Pagination } from "./components/Pagenation";
import { SearchInput } from "./components/Serchinput";
import { SongList } from "./components/SongList";
import { getToken, getPlaylistById, searchSongs } from "./lib/spotify";
import { useState, useEffect } from "react";

interface Track {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    album_type: string;
    available_markets: string[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  popularity: number;
  track_number: number;
  type: string;
  uri: string;
  href: string;
  explicit: boolean;
  is_local: boolean;
}

interface PlaylistTrackItem {
  track: Track;
}

function App() {
  const [token, setToken] = useState<string>("");
  const [specificPlaylistTracks, setSpecificPlaylistTracks] = useState<Track[]>(
    []
  );
  const [playListName, setPlayListName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searchedSongs, setSearchedSongs] = useState<Track[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 20; // Number of items per page
  const [maxPage, setMaxPage] = useState<number>();
  //const [hasNext, setHasNext] = useState(false);

  
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Get the token ONCE
        const tokenData = await getToken();
        setToken(tokenData || "No token received");

        // Then fetch specific playlist and popular playlists using the same token
        if (tokenData) {
          // Get specific playlist
          const specificPlaylistData = await getPlaylistById(
            tokenData,
            "5SLPaOxQyJ8Ne9zpmTOvSe"
          );
          if (specificPlaylistData) {
            // Access tracks through the items property
            setPlayListName(specificPlaylistData.name);
            const tracks = specificPlaylistData.tracks.items.map(
              (item: PlaylistTrackItem) => {
                return item.track;
              }
            );
            setSpecificPlaylistTracks(tracks);
            console.log("Specific playlist tracks:", tracks);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        setToken("Error fetching token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers for search input and button
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleOnClickNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(nextPage);

    console.log("Next page:", nextPage);
  };

  const handleOnClickPrevPage = () => {
    const prevPage = page > 1 ? page - 1 : 1;
    setPage(prevPage);
    handleSearch(prevPage);
  };

  const handleSearchButton = () => {
    setPage(1); // Reset to first page when doing new search
    handleSearch(1);
  };

  const handleSearch = async (page: number) => {
    setIsLoading(true);
    if (token && keyword) {
      try {
        const offset = page ? (page - 1) * limit : 0;
        const results = await searchSongs(token, keyword, limit, offset);
        console.log("Search results:", results);

        if (results && results.tracks && results.tracks.items.length > 0) {
          // Extract the tracks from the search response
          const tracks = results.tracks.items;
          setSearchedSongs(tracks);
          console.log("Searched playlist tracks:", tracks);
          setPlayListName(`Search Results for "${keyword}"`);

          const totalResults = results.tracks.total;
          console.log("Total search results:", totalResults);
          setMaxPage(Math.ceil(totalResults / limit));
        } else {
          setSearchedSongs([]);
          console.log("No search results found");
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchedSongs([]);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-20">
          <h1 className="text-4xl font-bold">Spotify App</h1>
          <div className="text-sm text-gray-400">
            {token ? "✅ Connected" : "🔄 Connecting..."}
          </div>
        </header>

        {/* Error Display Section */}
        {error && (
          <div className="mb-8 bg-red-900/50 border border-red-500 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-400 text-lg mr-2">⚠️</span>
              <h3 className="text-red-300 font-semibold">Error</h3>
            </div>
            <p className="text-red-200 mt-2">{error}</p>
          </div>
        )}

        <section>
          <SearchInput
            onInputChange={handleInputChange}
            onSearch={handleSearchButton}
          />
          <h2 className="text-xl font-semibold mb-5">{playListName}</h2>
          <SongList
            isLoading={isLoading}
            songs={
              searchedSongs.length > 0 ? searchedSongs : specificPlaylistTracks
            }
          />
          {specificPlaylistTracks && (
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Loaded specific playlist successfully!
              </p>
            </div>
          )}
          {searchedSongs.length > 0 && (
            <Pagination
              onNext={handleOnClickNextPage}
              onPrevious={handleOnClickPrevPage}
              page={page}
              maxPage={maxPage}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

//TODO: revise logic of next button disable logic
//TODO: Show current page and total pages
//TODO: Fix hasNext logic
//TODO: Set up next button disable logic(at the end of pages)
//TODO: add total count of search results and display it
//TODO: add category search filter
