import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Scenario } from "../types/scenario";
import { Card } from "../types/card";
import { Cards } from "../types/cards";
import { GameMap } from "../types/game-map";
import { Tile } from "../types/tile";
import { Cell } from "../types/cell";
import { Unit, UnitType } from "../types/unit";
import { LogType, Log } from "../types/log";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root"
})
export class GameService {
  PLAYERS = ['us','german'];

  scenarios: Array<Scenario> = [];
  map: GameMap;
  scenario: Scenario;
  bot: string;
  player: string;
  logs: Array<Log> = [];
  germanCards: Cards;
  usCards: Cards;

  botDeck: Array<Card>;
  botHand: Array<Card>;
  botPlayed: Array<Card>;
  botDiscard: Array<Card>;
  tiles: Record<string, Tile>;
  units: Array<Unit>;

  tileSize: number = 82;
  unitSize: number = 41;
  rotateMap: false;
  outsideHeight: number = 100;


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
    this.player = this.otherPlayer(this.bot);

    //TODO: aggiungere logica per partenza scenario
    this.toastr.success('Hello world!', 'Toastr fun!');

    this.logs.push(new Log(0, "first round", LogType.ROUND_START));
    this.logs.push(new Log(0, "first player", LogType.PLAYER_START));
    this.logs.push(new Log(0, "log1", LogType.LOG));
    this.logs.push(new Log(0, "game end", LogType.GAME_END));

    this.map = new GameMap(10, 10);
    this.map.setCell(0, 0, new Cell('A1', 0, 0, 1, 1));
    this.map.setCell(1, 0, new Cell('A2', 1, 0, 2, 2));
    this.map.setCell(2, 0, new Cell('A3', 2, 0, 1, 1));
    this.map.setCell(3, 0, new Cell('A4', 3, 0, 1, 1));
    this.map.setCell(4, 0, new Cell('A5', 4, 0, 2, 2));
    this.map.setCell(5, 0, new Cell('A6', 5, 0, 1, 1));
    this.map.setCell(6, 0, new Cell('A7', 6, 0, 1, 1));
    this.map.setCell(7, 0, new Cell('A8', 7, 0, 2, 2));
    this.map.setCell(0, 1, new Cell('A9', 0, 1, 1, 1));
    this.map.setCell(1, 1, new Cell('A10', 1, 1, 1, 1));
    this.map.setCell(1, 2, new Cell('A11', 1, 2, 1, 1));
    this.map.setCell(1, 3, new Cell('A12', 1, 3, 1, 1));
    this.map.setCell(1, 4, new Cell('A13', 1, 4, 1, 1));
    this.map.setCell(1, 5, new Cell('A14', 1, 5, 1, 1));
    this.map.setCell(1, 6, new Cell('A15', 1, 6, 1, 1));
    this.map.setCell(1, 7, new Cell('A16', 1, 7, 1, 1));

    this.units = [];
    this.units.push(new Unit('us',UnitType.Scout,'A','A1'));
    this.units.push(new Unit('us',UnitType.Scout,'B','A2'));
    this.units.push(new Unit('us',UnitType.Rifleman,'A','A1'));
    this.units.push(new Unit('us',UnitType.Rifleman,'B','A2'));
    this.units.push(new Unit('german',UnitType.Scout,'A','A3'));
    this.units.push(new Unit('german',UnitType.Rifleman,'A','A3'));
    this.units.push(new Unit('german',UnitType.Scout,'B','A4'));
    this.units.push(new Unit('german',UnitType.Rifleman,'B','A4'));

  }

  getCellDrawCoords(cell: Cell) {
    let x = cell.x * this.tileSize;
    if (cell.y % 2 == 1) {
      x += this.tileSize / 2;
    }
    let y = cell.y * this.tileSize + this.outsideHeight;
    return { x, y };
  }

  renderCellStyle(cell: Cell): String {
    let { x, y } = this.getCellDrawCoords(cell);
    var style = "left:" + x + "px; top:" + y + "px;";
    return style;
  }

  getUnitDrawCoords(unit: Unit){
    let x;
    let y;
    let offset=0;

    if (unit.tileName){
      let cell = this.map.findTile(unit.tileName);
      let ret = this.getCellDrawCoords(cell);
      x = ret.x;
      y = ret.y;
    } else {
      x = 0;
      y = 0;
    }
    
    let otherUnits = this.findOtherUnits(unit.tileName, unit);

    otherUnits.forEach((element:Unit) => {
      if (element.key>unit.key){
        offset ++;
      }
    });

    x+=offset*this.unitSize;

    return {x,y};
  } 
  
  renderUnitStyle(unit: Unit): String{
    let {x,y} = this.getUnitDrawCoords(unit);
    var style="left:"+x+"px; top:"+y+"px;";
    return style;
  }

  findOtherUnits(tileName: string, unit: Unit){
    let units = [];
    this.units.forEach((unitItem : Unit) => {
      if (unitItem.tileName === tileName && unitItem.key !== unit.key){
        units.push(unitItem);
      }
    });
    return units;
  }

  renderContainerStyle(): string{
    let maxWidth=0;
    let maxHeight=0;
    for (const key in this.map.cells){
      let cell = this.map.cells[key];
      let {x,y} = this.getCellDrawCoords(cell);
      let width = x+this.tileSize;
      let height = y+this.tileSize;
      if (width>maxWidth){
        maxWidth = width;
      }
      if (height>maxHeight){
        maxHeight = height;
      }
    }

    return "width:"+maxWidth+"px; height:"+maxHeight+"px;";
  }

  setCellScouted(cell: Cell, player: string, scouted: boolean){
    cell[player].scouted = scouted;
    if (!scouted && cell[player].occupied) {
      this.setCellOccupied(cell, player, false);
    }
  }
  
  findEnemiesInCell(cell, player):Array<Unit>{
    let enemies = [];
    let enemyPlayer: string = this.otherPlayer(player);
    this.units.forEach((unit: Unit) => {
      if (unit.owner === enemyPlayer && unit.tileName === cell.name){
        enemies.push(unit)
      }
    });
    return enemies;
  }

  setCellOccupied(cell: Cell, player: string, occupied: boolean){
    cell[player].occupied = occupied;
    this.determineWinner();
  }

  setCellTarget(cell: Cell, player: string, target: boolean){
    if (target){
      for (const key in this.map.cells){
        let cell = this.map.cells[key];
        if (cell[player].target){
          this.setCellTarget(cell, player, false);
        } 
      }
    }
    cell[player].target = target;
  }

  setUnitSuppressed(unit: Unit, suppresed){
    unit.suppressed = suppresed;
  }
  
  inflictCasualty(unit: Unit){
    //FIXME: add logic for inflicting casulty
    this.determineWinner();
  }

  determineWinner(){
    //FIXME: add logic for winning/losing game
  }

  otherPlayer(player: string): string{
    if (player == 'us'){
      return 'german';
    }
    return 'us';
  }
}
