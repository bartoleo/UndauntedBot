import { GameMap } from "./game-map";

export enum UnitType {
  PlatoonSergeant = "PlatoonSergeant",
  PlatoonGuide = "PlatoonGuide",
  SquadLeader = "SquadLeader",
  Rifleman = "Rifleman",
  Scout = "Scout",
  MachineGunner = "MachineGunner",
  Sniper = "Sniper",
  Mortar = "Mortar"
}

export class Unit {
  key: string;
  unitType: UnitType;
  squad: string;
  owner: string;
  suppressed: boolean = false;
  tileName: string; 

  constructor(owner: string, unitType: string, squad: string, tileName: string){
    this.key=owner+"_"+unitType+"_"+squad;
    this.owner = owner;
    this.unitType = UnitType[Object.keys(UnitType).filter(x => UnitType[x] == unitType)[0]];
    this.tileName = tileName;
    this.squad = squad;
  }

}
