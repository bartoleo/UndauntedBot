import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { StartMenuComponent } from "./startmenu.component";
import { GameComponent } from "./game.component";

import { MatSelectModule } from "@angular/material/select";

import { MatToolbarModule } from "@angular/material/toolbar";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from "@angular/common/http";

import { RouterModule } from "@angular/router";

import { APP_BASE_HREF } from "@angular/common";
import { GameService } from "./services/game.service";
import { ConfirmDialogModule } from "./shared/confirm-dialog/confirm-dialog.module";

export function initApp(gameService: GameService) {
  // Do initing of services that is required before app loads
  // NOTE: this factory needs to return a function (that then returns a promise)
  return () => gameService.init(); // + any other services...
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule,
    ConfirmDialogModule,
    RouterModule.forRoot([
    { path: "startMenu", component: StartMenuComponent },
    { path: "game", component: GameComponent },
    { path: "", redirectTo: "/startMenu", pathMatch: "full" }
], { relativeLinkResolution: 'legacy' })
  ],
  declarations: [AppComponent, StartMenuComponent, GameComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    {
      provide: APP_INITIALIZER,

      // useFactory: (i18NService: I18nService) => () => i18NService.initMessages(I18Enum.ru),
      // or
      useFactory: initApp,

      deps: [GameService],
      multi: true
    }
  ]
})
export class AppModule {}
