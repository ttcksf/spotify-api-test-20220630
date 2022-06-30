import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = process.env.React_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    console.log(token);
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });
    console.log(data);
    setArtists(data.artists.items);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id}>
        {artist.images.length ? (
          <img src={artist.images[0].url} alt="" />
        ) : (
          <div>画像がありません</div>
        )}
        {artist.name}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Spotify API</h1>
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          ログイン
        </a>
      ) : (
        <button onClick={logout}>ログアウト</button>
      )}

      {token ? (
        <form onSubmit={searchArtists}>
          <input
            type="text"
            placeholder="入力してください"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button type={"submit"}>検索</button>
        </form>
      ) : (
        <h2>ログインしてください</h2>
      )}

      {renderArtists()}
    </div>
  );
}

export default App;
