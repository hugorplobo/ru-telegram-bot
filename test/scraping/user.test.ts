import { test, expect } from "vitest";
import { scrapeUser } from "../../src/services/scraping/user";

const mockReturn = `<table class="formulario" width="55%">
<caption>Dados para Gera&#231;&#227;o da Cobran&#231;a</caption>
<tr>
   <th>
     Matr&#237;cula:
   </th>
   <td>
     999999
   </td>
</tr>
<tr>
   <th>
     Nome:
   </th>
   <td>
     SICRANO DA SILVA
   </td>
</tr>
<tr>
   <th>
     V&#237;nculo:
   </th>
   <td>
     Discente
   </td>
</tr>
<tr>
   <th>
     Saldo Atual:
   </th>
   <td>
     99
   </td>
</tr>
<tr>
   <th>
     Valor por Cr&#233;dito: 
   </th>
   <td>		       				
     R$ 1,10
   </td>
</tr>
</table>`;

test("mock html should return default values", () => {
  const userData = scrapeUser(mockReturn);

  expect(userData).toStrictEqual({
    name: "SICRANO DA SILVA",
    credits: 99,
  });
});