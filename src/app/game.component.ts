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

    {{ gameService.scenario }}
    {{ gameService.bot }}

    log map cards
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
