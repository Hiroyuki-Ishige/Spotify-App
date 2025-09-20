import "./App.css";
import { SongList } from "./components/SongList";
import { getToken, getPlaylistById } from "./lib/spotify";
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

// interface Playlist {
//   id: string;
//   name: string;
//   description: string;
//   images: Array<{ url: string }>;
//   external_urls: { spotify: string };
//   tracks?: {
//     total: number;
//     items: PlaylistTrackItem[];
//   };
// }

function App() {
  const [token, setToken] = useState<string>("");
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);
  // const [specificPlaylist, setSpecificPlaylist] = useState<Playlist | null>(
  //   null
  // );
  const [specificPlaylistTracks, setSpecificPlaylistTracks] = useState<Track[]>(
    []
  );
  const [playListName, setPlayListName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          if (
            specificPlaylistData
            //  && specificPlaylistData.items
          ) {
            // setSpecificPlaylist(specificPlaylistData);
            // console.log("Specific playlist Data:", specificPlaylistData);

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

          //Get popular playlists
          // const playlistData = await getPopularPlaylists(tokenData, 20);
          // if (playlistData) {
          //   setPlaylists(playlistData);
          //   // console.log("Popular playlists:", playlistData);
          // }
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
          <h2 className="text-xl font-semibold mb-5">{playListName}</h2>
          <SongList isLoading={isLoading} songs={specificPlaylistTracks} />
          {specificPlaylistTracks && (
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Loaded specific playlist successfully!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
