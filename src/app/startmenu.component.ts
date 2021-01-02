import { Component, Input } from "@angular/core";
import { Scenario } from "./types/scenario";
import { GameService } from "./services/game.service";
import { Router } from "@angular/router";

@Component({
  selector: "startmenu",
  template: `
    <mat-toolbar color="primary">
      Undautend Bot
    </mat-toolbar>
    <form class="form-horizontal">
      <div class="line-upper"></div>
      <h1>UNDAUNTED</h1>
      <h2 fxLayout="row">
        <span fxFlex="auto" class="line-upper">&nbsp;</span>
        <span class="subtitle">BOT</span>
        <span fxFlex="auto" class="line-upper">&nbsp;</span>
      </h2>
      <div class="info">
        Undaunted: Normandy is designed by David Thompson and Trevor
        Benjamin.<br />Bot v.0.0.1 by bartoleo
      </div>
      <mat-form-field appearance="standard">
        <mat-label>Scenario</mat-label>
        <mat-select required [(value)]="scenario">
          <mat-option
            *ngFor="let scenario of gameService.scenarios"
            [value]="scenario.id"
          >
            {{ scenario.name }}
          </mat-option>
        </mat-select>
        <mat-hint>Select the scenario to play</mat-hint>
      </mat-form-field>
      <p>
        <mat-label class="bot-label">US: </mat-label>
        <mat-button-toggle-group
          name="fontStyle"
          aria-label="Font Style"
          appearance="standard"
          [(value)]="bot"
        >
          <mat-button-toggle value="german"
            ><i class="icon-bot large"></i> Bot</mat-button-toggle
          >
          <mat-button-toggle value="us"
            ><i class="icon-human large"></i> Player</mat-button-toggle
          >
        </mat-button-toggle-group>
      </p>
      <p>
        <mat-label class="bot-label">German: </mat-label>
        <mat-button-toggle-group
          name="fontStyle"
          aria-label="Font Style"
          appearance="standard"
          [(value)]="bot"
        >
          <mat-button-toggle value="us"
            ><i class="icon-bot large"></i> Bot</mat-button-toggle
          >
          <mat-button-toggle value="german"
            ><i class="icon-human large"></i> Player</mat-button-toggle
          >
        </mat-button-toggle-group>
      </p>
      <div fxLayout="row">
        <button
          fxFlex="100"
          mat-raised-button
          color="primary"
          [disabled]="scenario == null"
          (click)="onStartPlay()"
        >
          <mat-icon>play_circle</mat-icon> Start
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      h1 {
        font-family: BodoniXT;
        letter-spacing: 0.04em;
        font-weight: 200;
        font-size: 32px;
        text-align: center;
      }
      h2 {
        font-family: BodoniXT;
        letter-spacing: 0.04em;
        font-weight: 200;
        font-size: 24px;
        text-align: center;
      }
      h2 .subtitle {
        margin-left: 10px;
        margin-right: 10px;
        font-family: NewStenciltfb;
      }
      .info {
        font-family: BodoniXT;
      }
      .line-upper {
        border-top: 1px solid black;
      }
      .bot-label {
        width: 5em;
        margin-right: 5px;
        display: inline-block;
        text-align: right;
      }
    `
  ]
})
export class StartMenuComponent {
  @Input() name: string;
  bot: string = "german";
  scenario: number = 1;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit() {
    this.gameService.init();
  }

  onStartPlay() {
    this.gameService.startScenario(this.scenario, this.bot);
    this.router.navigateByUrl("game");
  }
}
