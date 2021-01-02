import { Component, Input } from "@angular/core";
import { GameService } from "./services/game.service";

@Component({
  selector: "game-logs",
  template: `
    <div class="log"
            *ngFor="let log of gameService.logs"
          >
      {{log.renderHtml()}}
    </div>
  `,
  styles: [``]
})
export class GameLogsComponent {
  constructor(
    public gameService: GameService,
  ) {}

  ngOnInit() {}

}
