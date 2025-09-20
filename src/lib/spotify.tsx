import axios from "axios";

class spotifyClient {
  private static accessToken: string | null = null;

  static async initialize() {
    // Return cached token if it exists
    if (this.accessToken) {
      console.log("Using cached access token");
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        {
          grant_type: "client_credentials",
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("New access token obtained:", response.data);

      // Cache the token
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error("Error fetching token:", error);
      // Instead of returning null, throw the error so it can be caught in the UI
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get Spotify access token: ${errorMessage}`);
    }
  }
}

export const getToken = () => spotifyClient.initialize();

export const getPopularPlaylists = async (
  token: string,
  limit: number = 20
) => {
  try {
    if (!token) {
      throw new Error("No access token provided");
    }

    // Using search API to get popular playlists instead of browse/featured-playlists
    // because Client Credentials doesn't support browse endpoints
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=year:2023&type=playlist&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Popular Playlists API Response:", response.data);
    return response.data.playlists.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return null;
  }
};

export const getPlaylistById = async (token: string, playlistId: string) => {
  try {
    if (!token) {
      throw new Error("No access token provided");
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Playlist Details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
};
