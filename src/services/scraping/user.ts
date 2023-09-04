import { load } from "cheerio";

interface UserScrap {
  name: string,
  credits: number,
};

export function scrapeUser(html: string): UserScrap {
  const $ = load(html);
  const cells = $("table.formulario tbody tr td")
    .filter((i, _) => i < 4);
  
  const [_enrollment, name, _bound, credits] = cells
    .text()
    .trim()
    .replace(/[\t]+/gm, "")
    .split("\n")
    .filter((_, i) => i % 2 === 0)
    .map(value => value.trim());
  
  return {
    name,
    credits: Number(credits),
  };
}