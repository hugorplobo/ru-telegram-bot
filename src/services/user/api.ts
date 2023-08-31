import { User } from "../../model/user";
import { scrapeUser } from "../../scraping/user";

const url = "https://si3.ufc.br/public//jsp/restaurante_universitario/consulta_comensal_ru.jsf";

interface UserInfo extends User {
  credits: number,
};

export enum UserAPIError {
  FAILED_CONNECTION = "O serviço aparentemente está indisponível, tente novamente em alguns instantes!",
};

export async function getInfo(user: User): Promise<UserInfo> {
  for (let i = 0; i < 5; i++) {
    try {
      const data = new FormData();
      data.append("form", "form");
      data.append("form:j_id_jsp_1091681061_2", user.cardNumber);
      data.append("form:j_id_jsp_1091681061_3", user.enrollment);
      data.append("form:j_id_jsp_1091681061_4", "Consultar");
      data.append("javax.faces.ViewState", "j_id1");

      const session = await getSession();
      const headers = new Headers();
      headers.append("Cookie", session);

      const res = await fetch(url, {
        method: "POST",
        body: data,
        headers,
      });

      const html = await res.text();
      const { credits, name } = scrapeUser(html);

      return { ...user, credits, name };
    } catch (e) {
      console.error("Falha na conexão. Tentando novamente em 5 segundos...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  throw new Error(UserAPIError.FAILED_CONNECTION);
}

async function getSession() {
  const res = await fetch(url);
  return res.headers.get("Set-Cookie")!;
}