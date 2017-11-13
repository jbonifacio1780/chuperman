/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Geolocation, Geoposition } from 'ionic-native';
import { MapConst } from './map.constants';
import {  } from '@types/googlemaps';

//import { GeolocationMarker } from 'geolocation-marker'

interface IMapOptions {
  lat: number;
  lon: number;
  zoom: number;
  disableDefaultUI:boolean;
  mapTypeControl:false;
}

@Injectable()
export class MapService {

  private map: google.maps.Map = null;
  private infoWindow: google.maps.InfoWindow = null;

  constructor() {
  }

  public createMap(mapEl: Element, opts: IMapOptions = {
    lat: MapConst.DEFAULT_LAT,
    lon: MapConst.DEFAULT_LNG,
    zoom: MapConst.DEFAULT_ZOOM,
    disableDefaultUI: true,
    mapTypeControl: false
  }): Promise<google.maps.Map> {

    return this.loadMap().then(() => {
      const myLatLng = new google.maps.LatLng(opts.lat, opts.lon);
      /*const styleArray = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {visibility: 'off'}
          ]
        }
      ];*/

      const mapOptions: google.maps.MapOptions = {
        zoom: opts.zoom,
        minZoom: opts.zoom,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        scaleControl: false,
        //gestureHandling: 'auto',
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
        },

        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                //"color": "#e5e5e5"
                color:"#92fc64"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                //"color": "#9e9e9e"
                color:"#8e918c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                //"color": "#ffffff"
                color:"#efeaea"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                //"color": "#dadada"
                color:"#d1cccc"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                //"color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
                //color:"#a09d9d"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
                //color:"#898484"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                //"color": "#3ba1da"
                color:"#7fc2db"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      };

      //var GeoMarker = new google.maps.Circle(mapOptions);
      this.map = new google.maps.Map(mapEl, mapOptions);
      //const myLatLng2 = new google.maps.LatLng(opts.lat, opts.lon);

      

      //for (var city in citymap) {
        // Add the circle for this city to the map.
        
      //}

      return this.map;
    });
  }

  /**
   * return the coordinates of the center of map
   * @returns {LatLng}
   */
  public get mapCenter(): google.maps.LatLng {
  try
  {
    return this.map.getCenter();
  }
  catch (e){}

  }

  public set mapCenter(location: google.maps.LatLng) {
    this.map.setCenter(location);
  }

  /***
   * return map html element
   * @returns {Element}
   */
  public get mapElement(): Element {
    try
    {
      return this.map.getDiv();
  
    }
    catch(e){}
  }
  /***
   * create an infoWindow and display it in the map
   * @param content - the content to display inside the infoWindow
   * @param position
   */
  public createInfoWindow(content: string, position: google.maps.LatLng): void {
    this.closeInfoWindow();
    const opt: google.maps.InfoWindowOptions = {
      content,
      position,
      pixelOffset: new google.maps.Size(0, -50),
      disableAutoPan: true
    };
    this.infoWindow = new google.maps.InfoWindow(opt);
    setTimeout(() => this.infoWindow.open(this.map), 100);
  }

  public createRadius(position: google.maps.LatLng)
  {
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      //center: citymap[city].center,
      center: position,

      radius: Math.sqrt(50) * 5
    });
  }

  

  /***
   * close the current infoWindow
   */
  public closeInfoWindow(): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  /***
   * create Place Autocomplete
   * ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
   * @param addressEl
   * @returns {Observable}
   */
  public createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  /***
   * set map position and the relative center and zoom
   * @returns {Promise<google.maps.LatLng>}
   */
  public setPosition(): Promise<google.maps.LatLng> {
    return this.getCurrentPosition().then((coords: Coordinates) => {
      if (!coords) {
        console.warn('invalid coordinates: ', coords);
        return null;
      }
      const myLatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      this.map.setCenter(myLatLng);
      this.map.setZoom(MapConst.MAX_ZOOM);
      return this.mapCenter;
    });
  }

  /***
   * trigger map resize event
   */
  public resizeMap(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  /***
   * google map place searches
   * @returns {Observable}
   */
  public loadNearbyPlaces(): Observable<any> {
    const position: google.maps.LatLng = this.mapCenter;

    const placesService = new google.maps.places.PlacesService(this.map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: position,
      radius: 500
    };

    return new Observable((sub: any) => {
      placesService.nearbySearch(request, (results, status) => {
        const _nearbyPlaces: Array<any> = [];
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            const place: any = results[i];
            const distance: number =
              google.maps.geometry.spherical.computeDistanceBetween(position, place.geometry.location);
            place.distance = distance.toFixed(2);
            _nearbyPlaces.push(place);
          }
          sub.next(_nearbyPlaces);
          sub.complete();
        } else {
          sub.error({
            message: `Invalid response status from nearbySearch : ${status}`
          });
        }
      });
    });
  }

  /***
   * Load Google Map Api in async mode
   * @returns {Promise}
   */
  private loadMap(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if ((<any>window).google && (<any>window).google.maps) {
        resolve();
      } else {
        this.loadGoogleMapApi().then(() => resolve()).catch(reason => {
          reject(reason);
        });
      }
    });
  }

  /***
   * get the current location using Geolocation cordova plugin
   * @param maximumAge
   * @returns {Promise<Coordinates>}
   */
  private getCurrentPosition(maximumAge: number = 10000): Promise<Coordinates> {
    const options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge
    };
    return Geolocation.getCurrentPosition(options).then((pos: Geoposition) => {
      return pos.coords;
    });
  }

  /***
   * Create a script element to insert into the page
   * @returns {Promise}
   * @private
   */
  private loadGoogleMapApi(): Promise<any> {
    const _loadScript = () => {
      const script = document.createElement('script');
      // tslint:disable-next-line
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&language=es&components=country:PE&callback=initMap`;
      script.type = 'text/javascript';
      script.async = true;
      const s = document.getElementsByTagName('script')[2];
      s.parentNode.insertBefore(script, s);
    };

    return new Promise((resolve: Function) => {
      (<any>window).initMap = () => {
        return resolve();
      };
      _loadScript();
    });
  }
}
