import { Cell } from "./cell";

export class GameMap {
  cells: Record<string,Cell>;

  constructor(width: number, height: number){
    this.cells = {};
    for (let x:number=0;x<width;x++){
      for (let y:number=0;y<height;y++){
        this.cells[this.generateKey(x,y)] = Cell.EmptyCell(x,y);
      }
    }
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

}
