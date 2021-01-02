export class Card {
  id: number;
  type: string;

  constructor(id: number, type: string){
    this.id = id;
    this.type = type;
  }

  renderHtml(){
    return this.type;
  }

}
