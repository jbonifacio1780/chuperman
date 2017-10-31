import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map';
import { IonicPage, NavController, NavParams,AlertController,LoadingController, ModalController, Platform, MenuController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Vibration } from '@ionic-native/vibration';
import { MapService } from '../../providers/map/map.service';
import { BasePage } from '../base-page';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';

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
  public ubicacion: string = "";

  constructor(private platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    private geocoderService: GeocoderService,
    private mapService: MapService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    protected alertCtrl: AlertController) {
    super(alertCtrl);
    this.menuCtrl.enable(true);   
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

        //const content = `<div padding><strong>${address}</strong></div>`;
        //this.mapService.createInfoWindow(content, position);
        this.ubicacion=address;

        //console.log(this.ubicacion);
        //this.Ubicacion=address;

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

  openModal(): void {
    const searchModal = this.modalCtrl.create(SearchPage);
    searchModal.present();
  }

  goToConfirmation(): void {
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.setRoot(HomePage,{direccion:this.ubicacion});
  }

  /**
   * Get the current position
   */
  private locate(): Promise<any> {
    const loader = this.loadingCtrl.create({
      spinner:"bubbles",
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




}
