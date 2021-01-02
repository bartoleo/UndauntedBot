export enum ScenarioType {
  CONQUER
}

export class Scenario {
  id: number;
  name: string;

  /*germanType: ScenarioType.CONQUER;
  usType: ScenarioType.CONQUER;
  map: object;
*/

  constructor(obj: object) {
    this.id = obj["id"];
    this.name = obj["name"];
  }
}
