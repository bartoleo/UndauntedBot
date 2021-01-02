import { Component, Input } from "@angular/core";
import { GameService } from "./services/game.service";

@Component({
  selector: "game-cards",
  template: `
    <div class="deck"
            *ngFor="let card of gameService.botDeck"
          >
      {{card.renderHtml()}}
    </div>
    <div class="hand"
            *ngFor="let card of gameService.botHand"
          >
      {{card.renderHtml()}}
    </div>
    <div class="played"
            *ngFor="let card of gameService.botPlayed"
          >
      {{card.renderHtml()}}
    </div>
    <div class="discard"
            *ngFor="let card of gameService.botDiscard"
          >
      {{card.renderHtml()}}
    </div>
  `,
  styles: [``]
})
export class GameCardsComponent {
  constructor(
    public gameService: GameService,
  ) {}

  ngOnInit() {}

}
