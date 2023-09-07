import { CheerioAPI, load } from "cheerio";

interface Menu {
  lunch: {
    title: string,
    data: Map<string, string>,
  },
  dinner: {
    title: string,
    data: Map<string, string>,
  }
};

export function scrapeMenu(html: string): string[] {
  const $ = load(html);
  const lunch = getPartialMenu($, "almoco");
  const dinner = getPartialMenu($, "jantar");

  return parseMenu({
    lunch: {
      title: "Almoço",
      data: lunch,
    },
    dinner: {
      title: "Jantar",
      data: dinner,
    },
  });
}

function getPartialMenu($: CheerioAPI, part: "almoco" | "jantar"): Map<string, string> {
  const partial = $(`table.${part} tr`);
  const cells = new Map<string, string>();

  partial.each((_, el) => {
    const title = $("td:nth-child(1)", el);
    const values = $("td:nth-child(2) span", el).map((_, el) => {
      return $.text([el]);
    }).toArray();

    let parsedValues = "";

    for (const value of values) {
      if (value.includes("(Contém Lactose)") || value.includes("(Contém Glúten)")) {
        parsedValues += " " + value.replace(/\(/gm, "\\(").replace(/\)/gm, "\\)").trim();
      } else {
        parsedValues += ", " + value.trim();
      }
    }

    parsedValues = parsedValues.replace(/^\,?\s/gm, "");

    cells.set(title.text(), parsedValues);
  });

  return cells;
}

function parseMenu(menu: Menu): string[] {
  const formattedTexts: string[] = [];

  Object.values(menu).forEach(value => {
    if (value.data.size > 0) {
      let string = `🍽 *${value.title}*: \n\n`;

      for (const [type, meal] of value.data) {
        string += `*${type}*: ${meal}\n`;
      }

      formattedTexts.push(string); 
    } else {
      formattedTexts.push(`Sem *${value.title} hoje!*`);
    }
  });

  return formattedTexts;
}