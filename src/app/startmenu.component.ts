import { Component, Input } from "@angular/core";

@Component({
  selector: "startmenu",
  template: `
    <h1>Undaunted Bot for solo gaming</h1>
    <div class="info">Undaunted: Normandy is designed by David Thompson and Trevor Benjamin.<br/>Bot v.0.0.1 by bartoleo</div>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
      info {
        font-family
      }
    `
  ]
})
export class StartMenuComponent {
  @Input() name: string;
}
