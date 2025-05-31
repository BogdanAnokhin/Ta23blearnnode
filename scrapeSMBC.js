import axios from "axios";
import { load } from "cheerio";

async function fetchSMBC() {
  const url = "https://www.smbc-comics.com/";
  const res = await axios.get(url);
  const $ = load(res.data);

  const imgTag = $("#cc-comic");
  const imgSrc = imgTag.attr("src");
  const fullImgUrl = imgSrc?.startsWith("http") ? imgSrc : `https://www.smbc-comics.com${imgSrc}`;
  const title = imgTag.attr("title")?.trim() || "Not found";
  const alt = imgTag.attr("alt")?.trim() || "Not found";

  console.log("Image URL:", fullImgUrl);
  console.log("Title:", title);
  console.log("Alt text:", alt);
}

fetchSMBC();
