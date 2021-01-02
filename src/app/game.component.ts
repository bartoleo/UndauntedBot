import { Component, Input } from "@angular/core";
import { Scenario } from "./types/scenario";
import { GameService } from "./services/game.service";
import { ConfirmDialogService } from "./shared/confirm-dialog/confirm-dialog.service";
import { Router } from "@angular/router";

@Component({
  selector: "game",
  template: `
    <mat-toolbar color="primary">
      <span>Undaunted Bot {{ gameService.scenario.name }}</span>
      <span class="toolbar-spacer"></span>
      <button
        mat-icon-button
        class="exit-icon"
        aria-label="Exit from scenario"
        (click)="onExit()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-toolbar>
<div class="game-content">
          <div gdAreas.xs="header |  map | logs | cards" gdGap="5px"
               gdColumns.xs="none"
               [ngStyle.xs]="{'max-width': '100%'}"
               ngClass.xs="game-content-xs"
               gdAreas.sm="header |  map | logs | cards" gdGap="5px"
               gdColumns.sm="none"
               [ngStyle.sm]="{'max-width': '100%'}"
               ngClass.sm="game-content-sm"
               gdAreas.gt-sm="header header | logs map | cards cards"
               gdColumns.gt-sm="auto-fill" [ngStyle]="{'max-width': 'auto'}"
               gdRows.gt-sm="100px 100% 100px"
               [ngStyle.gt-sm]="{'max-width': '100%'}"
               ngClass.gt-sm="game-content-gt-sm"
               >
            <div class="game-block header" gdArea="header">Scenario: {{gameService.scenario.name}} | Bot: {{ gameService.bot }}</div>
            <game-logs class="game-block logs" gdArea="logs">Log</game-logs>
            <game-map class="game-block map" gdArea="map">Map</game-map>
            <game-cards class="game-block cards" gdArea="cards">Cards</game-cards>
          </div>
</div>
  `,
  styles: [``]
})
export class GameComponent {
  constructor(
    public gameService: GameService,
    private router: Router,
    private dialogService: ConfirmDialogService
  ) {}

  ngOnInit() {}

  onExit() {
    let me = this;

    const options = {
      //title: "Exit",
      message: "You are about to close this game.",
      cancelText: "CANCEL",
      confirmText: "YES, CLOSE THE GAME"
    };

    this.dialogService.open(options);

    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        me.router.navigateByUrl("");
      }
    });
  }
}
