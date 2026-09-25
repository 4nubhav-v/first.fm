import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

function getUrl(customInfo) {
  return `http://ws.audioscrobbler.com/2.0/?method=user.get${customInfo}&user=lostglory_&api_key=${process.env.LASTFM_API_KEY}&format=json`;
}

async function fetchData(urlTopic, errorMessage) {
  const getURL = getUrl(urlTopic);
  try {
    const result = await fetch(getURL);
    const data = await result.json();
    return data;
  } catch (error) {
    return {
      status: "404",
      error: `${error}`,
      message: `${errorMessage}`,
    };
  }
}

app.get("/api/info", async (req, res) => {
  const value = await fetchData("info", "User not available");
  res.send(value);
});

app.get("/api/recents", async (req, res) => {
  const value = await fetchData("recenttracks", "Tracks not available");
  const dataJSON = {
    track: `${value.recenttracks.track[0].name}`,
    artist: `${value.recenttracks.track[0].artist["#text"]}`,
    album: `${value.recenttracks.track[0].album["#text"]}`,
    mbid: `${value.recenttracks.track[0].album.mbid}`,
    img: `${value.recenttracks.track[0].image[3]["#text"]}`,
  };
  res.send(dataJSON);
});

app.listen(port, () => {
  console.log(`Server open in http://localhost:${port}`);
});
