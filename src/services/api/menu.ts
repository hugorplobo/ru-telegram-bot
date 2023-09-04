import { scrapeMenu } from "../scraping/menu";

const url = "https://www.ufc.br/restaurante/cardapio/5-restaurante-universitario-de-quixada";

export async function getInfo() {
  const res = await fetch(url);
  const html = await res.text();
  
  return scrapeMenu(html);
}