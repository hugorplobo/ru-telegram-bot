import dayjs, { Dayjs } from "dayjs"
import { getInfo } from "../api/menu";

class MenuManager {
  menu: string[];
  lastUpdate: Dayjs;

  public async getMenu(): Promise<string[]> {
    const now = dayjs();

    if (now.day() === 0 || now.day() === 6) {
      return ["Sem cardápio nos fins de semana\\!"];
    }

    if (this.menu === undefined || this.menu === null || !now.isSame(this.lastUpdate)) {
      this.menu = await getInfo();
      this.lastUpdate = now;
    }
    
    return this.menu.map(meal => meal.replace("-", "\\-"));
  }
}

export const menuManager = new MenuManager();