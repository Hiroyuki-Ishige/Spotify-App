import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface SongListProps {
  isLoading: boolean;
  songs?: Array<{
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
  }>;
}

export function SongList(props: SongListProps) {
  if (props.isLoading)
    return (
      <div className="inset-0 flex justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {props.songs
        ? props.songs.map((song) => (
            <a
              key={song.id}
              href={song.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-800/20 rounded-lg p-2"
            >
              <img
                alt="thumbnail"
                src={
                  song.album.images[0]
                    ? song.album.images[0].url
                    : "https://via.placeholder.com/150"
                }
                className="mb-2 rounded"
              />
              <h3 className="text-lg font-semibold text-white">{song.name}</h3>
              <p className="text-gray-400">
                By {song.artists.map((artist) => artist.name).join(", ")}
              </p>
            </a>
          ))
        : "No songs available"}
    </div>
  );
}
