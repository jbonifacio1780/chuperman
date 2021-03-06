
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MapService } from '../../providers/map/map.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'it-map',
  template: '<div #map id="gmaps" data-tap-disabled="true"></div>'
})

@NgModule({
  //declarations: [ MapComponent ],
  //exports: [ MapComponent ],
  imports: [ CommonModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class MapComponent implements AfterViewInit {

  @Output() onMapReady = new EventEmitter();
  @Output() onMapIdle = new EventEmitter();
  @Output() onCenterChanged = new EventEmitter();
  @Output() onDragStart = new EventEmitter();

  @ViewChild('map') mapCanvas: any;
  map: any = null;

  constructor(private mapService: MapService) {
  }

  ngAfterViewInit() {
    const mapElem = this.mapCanvas.nativeElement;
    return this.mapService.createMap(mapElem).then((map) => {
      this.map = map;
      this.bindMapEvents(mapElem);
    });
  }

  private bindMapEvents(mapEl: HTMLElement): void {
    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(mapEl, 'mousedown', (e: any) => {
      e.preventDefault();
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.onMapReady.emit({
        value: this.map
      });
    });

    google.maps.event.addListenerOnce(this.map, 'center_changed', () => {
      this.onCenterChanged.emit({
        value: this.map
      });
    });

    google.maps.event.addListener(this.map, 'idle', () => {
      this.onMapIdle.emit({
        value: this.map
      });
    });

    google.maps.event.addListener(this.map, 'dragstart', () => {
      this.onDragStart.emit({
        value: this.map
      });
    });
  }
}
