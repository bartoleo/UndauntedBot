import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Scenario } from "../types/scenario";
import { Card } from "../types/card";
import { Cards } from "../types/cards";
import { GameMap } from "../types/game-map";
import { Tile } from "../types/tile";
import { Cell } from "../types/cell";
import { LogType, Log } from "../types/log";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root"
})
export class GameService {
  scenarios: Array<Scenario> = [];
  map: GameMap;
  scenario: Scenario;
  bot: string;
  logs: Array<Log> = [];
  germanCards: Cards;
  usCards: Cards;

  botDeck: Array<Card>;
  botHand: Array<Card>;
  botPlayed: Array<Card>;
  botDiscard: Array<Card>;
  tiles: Record<string,Tile>;

  constructor(public http: HttpClient, private toastr: ToastrService
    ) {
    this.loadScenarios();
  }

  init() {
    this.logs = [];
  }

  async loadScenarios() {
    let data = (await this.http
      .get("./assets/game-data.json")
      .toPromise()) as Array<Object>;

    data["scenarios"].forEach((element) => {
      this.scenarios.push(new Scenario(element));
    });

  }

  startScenario(id: number, bot: string) {
    this.init();

    this.scenarios.forEach((scenario) => {
      if (scenario.id === id) {
        this.scenario = scenario;
      }
    });

    this.bot = bot;

    //TODO: aggiungere logica per partenza scenario
    this.toastr.success('Hello world!', 'Toastr fun!');

    this.logs.push(new Log(0,"first round", LogType.ROUND_START));
    this.logs.push(new Log(0,"first player", LogType.PLAYER_START));
    this.logs.push(new Log(0,"log1", LogType.LOG));
    this.logs.push(new Log(0,"game end", LogType.GAME_END));

    this.map = new GameMap(10,10, 82, false);
    this.map.setCell(0,0, new Cell('A2',0,0,1,1));
    this.map.setCell(1,0, new Cell('A2',1,0,2,2));
    this.map.setCell(2,0, new Cell('A3',2,0,1,1));
    this.map.setCell(3,0, new Cell('A2',3,0,1,1));
    this.map.setCell(4,0, new Cell('A2',4,0,2,2));
    this.map.setCell(5,0, new Cell('A3',5,0,1,1));
    this.map.setCell(6,0, new Cell('A2',6,0,1,1));
    this.map.setCell(7,0, new Cell('A2',7,0,2,2));
    this.map.setCell(0,1, new Cell('A4',0,1,1,1));
    this.map.setCell(1,1, new Cell('A5',1,1,1,1));
    this.map.setCell(1,2, new Cell('A6',1,2,1,1));
    this.map.setCell(1,3, new Cell('A6',1,3,1,1));
    this.map.setCell(1,4, new Cell('A6',1,4,1,1));
    this.map.setCell(1,5, new Cell('A6',1,5,1,1));
    this.map.setCell(1,6, new Cell('A6',1,6,1,1));
    this.map.setCell(1,7, new Cell('A6',1,7,1,1));

  }
}
