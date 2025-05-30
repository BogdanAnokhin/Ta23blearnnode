import axios from "axios";
import * as cheerio from 'cheiro';
import fs from 'fs/promises';
import path from 'path';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create proper cache directory path
const cacheDir = path.join(process.cwd(), 'cache');

async function cacheGet(name) {
    try {
        const data = await fs.readFile(path.join(cacheDir, `${name}.html`), 'utf8');
        return data;
    } catch {
        return false;
    }
}

async function cacheSet(name, data) {
    await fs.writeFile(path.join(cacheDir, `${name}.html`), data);
}

async function fetchComic(comicId) {
    try {
        await sleep(1000 + Math.random() * 1000); // Random delay 1-2s
        
        console.log(`Fetching comic #${comicId}...`);
        const res = await axios.get(`https://xkcd.com/${comicId}/`, {
            headers: {
                'User-Agent': 'XKCD Scraper (educational)'
            },
            timeout: 5000
        });
        
        return res.data;
    } catch (error) {
        console.error(`Failed to fetch comic #${comicId}:`, error.message);
        return null;
    }
}

async function processComic(comicId) {
    let data = await cacheGet(comicId);
    
    if (!data) {
        data = await fetchComic(comicId);
        if (!data) return null;
        
        await cacheSet(comicId, data);
    }

    const $ = cheerio.load(data);
    const comicImg = $('#comic img');
    
    if (!comicImg.length) {
        console.log(`No comic image found for #${comicId}`);
        return null;
    }

    return {
        id: comicId,
        src: `https:${comicImg.attr('src')}`,
        title: comicImg.attr('alt') || 'No title',
        text: comicImg.attr('title') || 'No text'
    };
}

async function main() {
    try {
        await fs.mkdir(cacheDir, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error('Failed to create cache directory:', error);
            return;
        }
    }

    const comics = [];
    for (let i = 3088; i > 3078; i--) {
        const comic = await processComic(i);
        if (comic) {
            comics.push(comic);
            console.log(`#${comic.id}: ${comic.title}`);
            console.log(`Image: ${comic.src}\n`);
        }
    }

    // Save results to JSON file
    await fs.writeFile(
        path.join(cacheDir, 'comics.json'),
        JSON.stringify(comics, null, 2)
    );
    
    console.log(`Done! Processed ${comics.length} comics.`);
}

main().catch(console.error);