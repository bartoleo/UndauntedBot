import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { StartMenuComponent } from "./startmenu.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, StartMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
