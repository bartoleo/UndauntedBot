import { maxHeaderSize } from "http";
import { Cell } from "./cell";

export class GameMap {
  cells: Record<string,Cell>;
  rotate: boolean;
  tileSize: number;
  outsideHeight: number = 100;

  constructor(width: number, height: number, tileSize: number, rotate: boolean){
    this.cells = {};
    for (let x:number=0;x<width;x++){
      for (let y:number=0;y<height;y++){
        this.cells[this.generateKey(x,y)] = Cell.EmptyCell(x,y);
      }
    }
    this.tileSize = tileSize;
    this.rotate = rotate;
  }

  getCell(x: number, y:number){
    return this.cells[this.generateKey(x,y)];
  }

  setCell(x: number, y:number, cell: Cell){
    this.cells[this.generateKey(x,y)] = cell;
  }

  generateKey(x: number, y: number): string{
    return x+","+y;
  }

  renderContainerStyle(): string{
    let maxWidth=0;
    let maxHeight=0;
    for (const key in this.cells){
      let cell = this.cells[key];
      let {x,y} = cell.getDrawCoords(this);
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

}
