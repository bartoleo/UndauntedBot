export class CellPlayerFlags {
  scouted: boolean = false;
  occupied: boolean = false;
  spawn: Array<String>;
  target: boolean = false;

  constructor(scouted: boolean = false, occupied: boolean = false, spawn: Array<String> = []){
    this.scouted = scouted;
    this.occupied = occupied;
    this.spawn = spawn;
  }
}
