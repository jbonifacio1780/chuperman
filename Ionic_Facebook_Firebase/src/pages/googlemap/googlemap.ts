import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map';
import { IonicPage, NavController, NavParams,AlertController,LoadingController, ModalController, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Vibration } from '@ionic-native/vibration';
import { MapService } from '../../providers/map/map.service';
import { BasePage } from '../base-page';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { HomePage } from '../home/home';

declare var google;

/**
 * Generated class for the GooglemapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage extends BasePage {
  map: any;
  localized: boolean = false;

  constructor(private platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    private geocoderService: GeocoderService,
    private mapService: MapService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    protected alertCtrl: AlertController) {
    super(alertCtrl);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GooglemapPage');

    //this.getPosition();
  }

  



    /***
   * This event is fired when map has fully loaded
   */
  onMapReady(): Promise<any> {
    // I must wait platform.ready() to use plugins ( in this case Geolocation plugin ).
    return this.platform.ready().then(() => {
      return this.locate().then(() => {
        const mapElement: Element = this.mapService.mapElement;
        if (mapElement) {
          mapElement.classList.add('show-map');
          this.mapService.resizeMap();
          //this.setMarkers(mapElement);

        }
      });
    });
  }


  /***
   * This event is fired when the map becomes idle after panning or zooming.
   */
  onMapIdle(): void {
    if (!this.localized) return;
    const position = this.mapService.mapCenter;
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
      .subscribe((address: string) => {

        const content = `<div padding><strong>${address}</strong></div>`;
        this.mapService.createInfoWindow(content, position);

      }, (error) => {
        this.displayErrorAlert();
        console.error(error);
      });
  }

  
  /***
   * This event is fired when the user starts dragging the map.
   */
  onDragStart(): void {
    this.mapService.closeInfoWindow();
  }

  //openModal(): void {
  //  const searchModal = this.modalCtrl.create(SearchPage);
  //  searchModal.present();
  //}

  goToConfirmation(): void {
    //this.navCtrl.setRoot(HomePage);
  }

  /**
   * Get the current position
   */
  private locate(): Promise<any> {
    const loader = this.loadingCtrl.create({
      content: 'Espere por favor',
    });
    loader.present();
    return this.mapService.setPosition().then(() => {
      this.localized = true;
      // Vibrate the device for a second
      //Vibration.vibrate(1000);
      //navigator.vibrate(50);
    }).catch(error => {
      this.alertNoGps();
      console.warn(error);
    }).then(() => {
      // TODO why dismiss not working without setTimeout ?
      setTimeout(() => {
        loader.dismiss();
      }, 1000);
    });
  }

  private alertNoGps() {
    const alert = this.alertCtrl.create({
      title: 'Chuperman Delivery',
      subTitle: 'Los GPS y las ubicaciones de red no están disponibles. Haga clic en Aceptar para volver a intentar.',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          setTimeout(() => this.locate(), 1500);
        }
      }],
    });
    alert.present();
  }


  public setMarkers(map) {
    // Adds markers to the map.

    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
 
    const position = this.mapService.mapCenter;
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
    .subscribe(() => {
      
      var marker = new google.maps.Marker({
        position:position,
        map: map,
        icon: image,
        shape: shape
      });
      
      }, (error) => {
        this.displayErrorAlert();
        console.error(error);
      });

      
    
  }

}
