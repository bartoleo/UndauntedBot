import { debug } from "console";
import { timingSafeEqual } from "crypto";
import { CellPlayerFlags } from "./cell-player-flags";


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

  renderStyle(): String{
    var style=  "left:"+(this.x*80)+"px; top:"+(this.y*80)+"px;";
    return style;
  }

}
