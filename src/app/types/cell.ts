import { CellPlayerFlags } from "./cell-player-flags";
import { GameMap } from "./game-map";


export class Cell {
  name: string;
  german: CellPlayerFlags = new CellPlayerFlags();
  us: CellPlayerFlags = new CellPlayerFlags();
  x: number;
  y: number;
  radioTower: false;
  defence: number;
  defenceHill: number;

  constructor(name: string, x: number, y: number, defence: number, defenceHill: number){
    this.name = name;
    this.x = x;
    this.y = y;
    this.defence = defence;
    this.defenceHill = defenceHill;
  }

  static EmptyCell(x: number, y: number){
    return new Cell('',x,y,0,0);
  }

}
