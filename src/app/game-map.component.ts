import { Component, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { GameService } from "./services/game.service";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent, Subscription } from 'rxjs';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: "game-map",
  template: `
    <div class="map-container" [style]="gameService.map.renderContainerStyle()" >
    <button (click)="onClick()">aaa</button>
      <div class="map-outside">Outside</div>
      <ng-template ngFor let-cell [ngForOf]="gameService.map.cells | keyvalue" >
        <ng-template [ngIf]="cell.value.name">
          <div class="cell" [style]="cell.value.renderStyle(gameService.map)" (contextmenu)="openCellMenu($event, cell.value); $event. preventDefault();" >
            {{ cell.value.name }}
            <div cdkDrag cdkDragBoundary=".map-container"  (contextmenu)="openUnitMenu($event, user); $event. preventDefault();" >aaaa {{ cell.value.name }}</div>
          </div>
        </ng-template>
      </ng-template>
    </div>
    <ng-template #cellMenu let-cell>
      <section class="map-menu">
        <div (click)="delete(cell)">Delete {{cell.name}}</div>
        <div>Send to</div>
      </section>
    </ng-template>
    <ng-template #unitMenu let-unit>
      <section class="map-menu">
        <div (click)="delete(unit)">{{unit}}</div>
        <div>Send to</div>
      </section>
    </ng-template>
  `,
  styles: [`
  
.my-menu {
  background-color: #fff;
  border: 1px solid rosybrown;
  padding: 20px;
}


.map-menu {
  background-color: #fafafa;
  padding: 4pt;
  font-size: 10pt;
  z-index: 1000;
  box-shadow: 0 0 12pt rgba(0, 0, 0, 0.25);
  border-radius: 4pt;
  padding: 0.5em 0 0.5em 0;
  animation: fadeIn 0.1s ease-out;
  opacity:1.0;
  display:block;
}


.map-menu hr {
  border: none;
  border-bottom: 1px solid #eee;
}

.map-menu div {
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: #333;
  padding: 0.5em 2em 0.5em 0.75em;
  max-width: 18em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-menu div:hover {
  background-color: #333;
  color: #fff;
}


.map-menu div::before {
  content: '';
  float: left;
  margin-right: 0.75em;
  width: 0.5em;
  height: 1em;
  display: inline-block;
}



/* Animatinons */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1.0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1.0;
  }
}

@-webkit-keyframes fadeOut {
  from {
    opacity: 1.0;
  }
  to {
    opacity: 0.0;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1.0;
  }
  to {
    opacity: 0.0;
  }
}

.is-fadingIn {
  -webkit-animation: fadeIn 0.1s ease-out;
  animation: fadeIn 0.1s ease-out;
  opacity: 1.0;
  display: block;
}

.is-fadingOut {
  -webkit-animation: fadeOut 0.1s ease-out;
  animation: fadeOut 0.1s ease-out;
  opacity: 0.0;
  display: block;
}


`],
})
export class GameMapComponent {

  sub: Subscription;

  @ViewChild('cellMenu') cellMenu: TemplateRef<any>;
  @ViewChild('unitMenu') unitMenu: TemplateRef<any>;

  overlayRef: OverlayRef | null;

  constructor(
    public gameService: GameService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {}

  onClick(){
    this.gameService.map.getCell(0,0).name="aaaaa";
  }

  openCellMenu({ x, y }: MouseEvent, cell) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.cellMenu, this.viewContainerRef, {
      $implicit: cell
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close())

  }

  delete(user) {
    // delete user
    this.close();
  }

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}
