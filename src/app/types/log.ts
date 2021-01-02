export enum LogType {
  ROUND_START,
  PLAYER_START,
  GAME_END,
  LOG
}

export class Log {
  date: Date;
  id: number;
  text: string;
  type: LogType;

  constructor(id: number, text: string, type: LogType, date: Date=null) {
    this.id = id;
    this.text = text;
    this.type = type;
    if (date){
      this.date = date;
    } else {
      this.date = new Date();
    }
  }

  renderHtml():String{
    return this.text;
  }

}
