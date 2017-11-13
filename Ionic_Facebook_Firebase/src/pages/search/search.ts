/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */

import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { MapService } from '../../providers/map/map.service';
import { BasePage } from '../base-page';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import 'rxjs/add/operator/map';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage extends BasePage {
  cat: string = "direcciones"; // default button
  // reference : https://github.com/driftyco/ionic/issues/7223
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;

  ngAfterViewInit() {
    var searchInput = this.searchbar.nativeElement.querySelector('.searchbar-input');
    //console.log("Search input", searchInput);
  }
  public direcciones: FirebaseListObservable<any>;

  private nearbyPlaces: Array<any> = [];
  private addressElement: HTMLInputElement = null;

  constructor(private mapService: MapService,
              private zone: NgZone,
              protected alertCtrl: AlertController,
              public afd: AngularFireDatabase, 
              public afAuth: AngularFireAuth, 
              private viewCtrl: ViewController) {
    super(alertCtrl);
    this.direcciones = this.afd.list('/direccion/'+this.afAuth.auth.currentUser.uid)
    this.direcciones.subscribe(lista =>{
      console.log(lista);
    })
  }

  ionViewDidLoad() {
    //console.log(this.searchbar);
    this.initAutocomplete();
    this.loadNearbyPlaces();
  }

  dismiss(location?: google.maps.LatLng) {
    try{
    if (location) {
      this.mapService.mapCenter = location;
    }
    if (this.addressElement) {
      this.addressElement.value = '';
    }
    this.viewCtrl.dismiss();
  }
  catch(e){}
  }

  /***
   * Place item has been selected
   */
  selectPlace(place: any) {
    try{
    this.dismiss(place.geometry.location);
    }catch(e){}
  }

  private initAutocomplete(): void {

    
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.mapService.createAutocomplete(this.addressElement).subscribe((location) => {
      this.dismiss(location);
    }, (error) => {
      //this.displayErrorAlert();
      //console.error(error);
    });
  }

  private loadNearbyPlaces(): void {
    this.nearbyPlaces = [];
    this.mapService.loadNearbyPlaces().subscribe((_nearbyPlaces) => {
      // force NgZone to detect changes
      this.zone.run(() => {
        this.nearbyPlaces.push.apply(this.nearbyPlaces, _nearbyPlaces);
      });
    }, (error) => {
      this.displayErrorAlert();
      console.error(error);
    });
  }
}
