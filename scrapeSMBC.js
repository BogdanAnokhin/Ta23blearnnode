import axios from "axios";
import { load } from "cheerio";

async function fetchSMBC() {
  const url = "https://www.smbc-comics.com/";
  const res = await axios.get(url);
  const $ = load(res.data);

  const img = $("#cc-comic").attr("src");
  const title = $("#cc-comic").attr("title");
  const alt = $("#cc-comic").attr("alt");

  console.log("Image URL:", img);
  console.log("Title:", title);
  console.log("Alt text:", alt);
}

fetchSMBC();