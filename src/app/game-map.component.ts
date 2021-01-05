import { Component, ViewChild, TemplateRef, ViewContainerRef, ElementRef, Renderer2 } from '@angular/core';
import { GameService } from "./services/game.service";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent, Subscription } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Unit, UnitType } from "./types/unit";

@Component({
  selector: "game-map",
  template: `
    <div class="map-container" [style]="gameService.renderContainerStyle()" cdkDropListGroup>
      <div class="map-outside" 
          id="map-outside"
          cdkDropList [cdkDropListData]="''" [cdkDropListEnterPredicate]="onDropEnter" (cdkDropListDropped)="dropped($event)" 
          (cdkDropListEntered)="cdkDropListEntered($event)"
          (cdkDropListExited)="cdkDropListExited($event)"
        >
        <ng-template ngFor let-unit [ngForOf]="gameService.units" >
          <div [class]="unit.owner + ' squad'+unit.squad +' '+unit.unitType+' unit-wrapper'"  [style]="gameService.renderUnitStyle(unit)">
            <div class="unit" cdkDrag [cdkDragData]="unit" __cdkDragBoundary=".map-container"
              (contextmenu)="openUnitMenu($event, unit); $event.preventDefault();" >
                {{ unit.unitType }} {{unit.squad}}
            </div>
          </div>
        </ng-template>
      </div>
      <ng-template ngFor let-cellKV [ngForOf]="gameService.map.cells | keyvalue"  >
        <ng-template [ngIf]="cellKV.value.name">
          <div class="cell" [style]="gameService.renderCellStyle(cellKV.value)"
          (contextmenu)="openCellMenu($event, cellKV.value); $event.preventDefault();"           
          cdkDropList [cdkDropListData]="cellKV.value.name" (cdkDropListDropped)="dropped($event)" [cdkDropListEnterPredicate]="onDropEnter"
          (cdkDropListEntered)="cdkDropListEntered($event)"
          (cdkDropListExited)="cdkDropListExited($event)">
            {{ cellKV.value.name }}
            <div class="defence">{{ cellKV.value.defence }}</div>
            <ng-template [ngIf]="cellKV.value.defence!=cellKV.value.defenceHill">
              <div class="defenceHill">{{ cellKV.value.defenceHill }}</div>
            </ng-template>
            <ng-template ngFor let-player [ngForOf]="gameService.PLAYERS" >
              <ng-template [ngIf]="cellKV.value[player].occupied">
                <div [class]="player+ ' occupied icon-'+player"></div>
              </ng-template>
              <ng-template [ngIf]="cellKV.value[player].scouted && !cellKV.value[player].occupied">
                <div [class]="player+ ' scouted  icon-binoculars'"></div>
              </ng-template>
              <ng-template [ngIf]="cellKV.value[player].target">
                <div [class]="player+ ' target icon-target'"></div>
              </ng-template>
            </ng-template>
          </div>
        </ng-template>
      </ng-template>
    </div>
    <ng-template #cellMenu let-cell>
      <section class="map-menu" style="z-index:9999">
        <ng-template [ngIf]="cell[gameService.player].scouted===false">
          <div (click)="gameService.setCellScouted(cell,gameService.player, true)">Set scouted</div>
        </ng-template>
        <ng-template [ngIf]="cell[gameService.player].scouted===true">
          <div (click)="gameService.setCellScouted(cell,gameService.player, false)">Remove scouted</div>
        </ng-template>
        <ng-template [ngIf]="cell[gameService.player].occupied===false && cell[gameService.player].scouted===true && gameService.findEnemiesInCell(cell).length===0">
          <div (click)="gameService.setCellOccupied(cell,gameService.player, true)">Set occupied</div>
        </ng-template>
        <ng-template [ngIf]="cell[gameService.player].occupied===true">
          <div (click)="gameService.setCellOccupied(cell,gameService.player, false)">Remove occupied</div>
        </ng-template>
        <ng-template [ngIf]="cell[gameService.player].target===false">
          <div (click)="gameService.setCellTarget(cell,gameService.player, true)">Set mortar target</div>
        </ng-template>
        <ng-template [ngIf]="cell[gameService.player].target===true">
          <div (click)="gameService.setCellTarget(cell,gameService.player, false)">Remove mortar target</div>
        </ng-template>
      </section>
    </ng-template>
    <ng-template #unitMenu let-unit>
      <section class="map-menu" style="z-index:9999">
        <ng-template [ngIf]="unit.suppressed===false">
          <div (click)="gameService.setUnitSuppressed(unit,true)">Set suppressed</div>
        </ng-template>
        <ng-template [ngIf]="unit.suppressed===true">
          <div (click)="gameService.setUnitSuppressed(unit,false)">Remove suppressed</div>
        </ng-template>
        <div (click)="gameService.inflictCasualty(unit)">Inflict one casualty</div>
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
    public viewContainerRef: ViewContainerRef,
    private renderer: Renderer2) {
  }

  ngOnInit() { }


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

  
  openUnitMenu({ x, y }: MouseEvent, unit) {
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

    this.overlayRef.attach(new TemplatePortal(this.unitMenu, this.viewContainerRef, {
      $implicit: unit
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

  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  onDropEnter(){
    //TODO: custom logic drop?
    return true;
  }

  cdkDropListEntered(event: CdkDragEnter<string[]>) {
    this.renderer.addClass(event.container.element.nativeElement, 'drop-target');
  }

  cdkDropListExited(event: CdkDragExit<string[]>) {
    let preview = new ElementRef<HTMLElement>(document.querySelector('.drop-target'));
    if (preview && preview.nativeElement){
      this.renderer.removeClass(preview.nativeElement, 'drop-target');
    }
  }
  
  dropped(event: CdkDragDrop<Unit[]>) {
    event.item.data.tileName=event.container.data;

    let preview = new ElementRef<HTMLElement>(document.querySelector('.drop-target'));
    if (preview && preview.nativeElement){
      this.renderer.removeClass(preview.nativeElement, 'drop-target');
    }

    return;
  }

}
