import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Scenario } from "../types/scenario";
import { Map } from "../types/map";

@Injectable({
  providedIn: "root"
})
export class GameService {
  scenarios: Array<Scenario> = [];
  map: Map;
  scenario: Scenario;
  bot: string;

  constructor(public http: HttpClient) {
    //this.loadScenarios();
  }

  init() {
    this.loadScenarios();
  }

  async loadScenarios() {
    let data = (await this.http
      .get("./assets/scenarios.json")
      .toPromise()) as Array<Object>;

    data.forEach((element) => {
      this.scenarios.push(new Scenario(element));
    });
  }

  startScenario(id: number, bot: string) {
    this.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        this.scenario = scenario;
      }
    });
    this.bot = bot;
    //TODO: aggiungere logica per partenza scenario
  }
}
