import { expect, test } from "vitest";
import { scrapeMenu } from "../../src/scraping/menu";

const mockHtml = `<table class="refeicao almoco">
<tbody class="listras">                <tr class="item">
        <td class="principal">Principal</td>
        <td class="principal"><span class="desc">Carne acebolada</span><br /><span class="desc">Moqueca de peixe </span><span class="desc gluten"> (Contém Glúten)</span>                    </td>
    </tr>                <tr class="item">
        <td class="vegetariano">Vegetariano</td>
        <td class="vegetariano"><span class="desc">Bolinho de grão de bico ao molho escuro</span><span class="desc gluten"> (Contém Glúten)</span>                    </td>
    </tr>                <tr class="item">
        <td class="salada">Salada</td>
        <td class="salada"><span class="desc">acelga, couve manteiga e pepino</span>                    </td>
    </tr>                <tr class="item">
        <td class="guarnicao">Guarnição</td>
        <td class="guarnicao"><span class="desc">Macarrão espaguete</span><span class="desc gluten"> (Contém Glúten)</span>                    </td>
    </tr>                <tr class="item">
        <td class="acompanhamento">Acompanhamento</td>
        <td class="acompanhamento"><span class="desc">Arroz branco</span><br /><span class="desc">Arroz integral</span><br /><span class="desc">Feijão fardinho</span>                    </td>
    </tr>                <tr class="item">
        <td class="suco">Suco</td>
        <td class="suco"><span class="desc">Cajá</span>                    </td>
    </tr>                <tr class="item">
        <td class="sobremesa">Sobremesa</td>
        <td class="sobremesa"><span class="desc">Mamão</span><br /><span class="desc">Doce</span>                    </td>
    </tr>            </tbody>
</table>        <h3 id="jantar">Jantar</h3>
<table class="refeicao jantar">
<tbody class="listras">                <tr class="item">
        <td class="principal">Principal</td>
        <td class="principal"><span class="desc">Suíno ao molho barbecue</span><br /><span class="desc">Frango grelhado</span>                    </td>
    </tr>                <tr class="item">
        <td class="vegetariano">Vegetariano</td>
        <td class="vegetariano"><span class="desc">Fricassê de lentilha</span>                    </td>
    </tr>                <tr class="item">
        <td class="salada">Salada</td>
        <td class="salada"><span class="desc">abobrinha e chuchu</span>                    </td>
    </tr>                <tr class="item">
        <td class="guarnicao">Guarnição</td>
        <td class="guarnicao"><span class="desc">Macarrão parafuso</span><span class="desc gluten"> (Contém Glúten)</span>                    </td>
    </tr>                <tr class="item">
        <td class="acompanhamento">Acompanhamento</td>
        <td class="acompanhamento"><span class="desc">Arroz branco</span><br /><span class="desc">arroz integral</span><br /><span class="desc">Feijão de corda</span>                    </td>
    </tr>                <tr class="item">
        <td class="suco">Suco</td>
        <td class="suco"><span class="desc">Manga</span>                    </td>
    </tr>                <tr class="item">
        <td class="sobremesa">Sobremesa</td>
        <td class="sobremesa"><span class="desc">Melancia</span><br /><span class="desc">Doce</span>                    </td>
    </tr>            </tbody>
</table>`;

test("mock html should return default values", () => {
  const menu = scrapeMenu(mockHtml);

  expect(menu).toStrictEqual({
    lunch: {
      title: "Almoço",
      data: new Map<string, string>([
        ["Principal", "Carne acebolada, Moqueca de peixe \\(Contém Glúten\\)"],
        ["Vegetariano", "Bolinho de grão de bico ao molho escuro \\(Contém Glúten\\)"],
        ["Salada", "acelga, couve manteiga e pepino"],
        ["Guarnição", "Macarrão espaguete \\(Contém Glúten\\)"],
        ["Acompanhamento", "Arroz branco, Arroz integral, Feijão fardinho"],
        ["Suco", "Cajá"],
        ["Sobremesa", "Mamão, Doce"],
      ]),
    },
    dinner: {
      title: "Jantar",
      data: new Map<string, string>([
        ["Principal", "Suíno ao molho barbecue, Frango grelhado"],
        ["Vegetariano", "Fricassê de lentilha"],
        ["Salada", "abobrinha e chuchu"],
        ["Guarnição", "Macarrão parafuso \\(Contém Glúten\\)"],
        ["Acompanhamento", "Arroz branco, arroz integral, Feijão de corda"],
        ["Suco", "Manga"],
        ["Sobremesa", "Melancia, Doce"],
      ]),
    }
  });
});