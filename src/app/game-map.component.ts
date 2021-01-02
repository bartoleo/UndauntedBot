import { Component, Input } from "@angular/core";
import { GameService } from "./services/game.service";
@Component({
  selector: "game-map",
  template: `
    <ng-template ngFor let-cell [ngForOf]="gameService.map.cells | keyvalue" >
      <ng-template [ngIf]="cell.value.name">
        <div class="cell" [style]="cell.value.renderStyle()" >
          {{ cell.value.name }}
          <div cdkDrag>aaaa {{ cell.value.name }}</div>
        </div>
      </ng-template>
    </ng-template>
    <button (click)="onClick()">aaa</button>
  `,
  styles: [``],
})
export class GameMapComponent {
  constructor(public gameService: GameService) {}

  ngOnInit() {}

  onClick(){
    this.gameService.map.getCell(0,0).name="aaaaa";
  }
}
