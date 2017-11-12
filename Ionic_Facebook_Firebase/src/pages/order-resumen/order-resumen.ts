import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';

/**
 * Generated class for the OrderResumenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-order-resumen',
  templateUrl: 'order-resumen.html',
})
export class OrderResumenPage {

  public idOrden: string="";
  public direccion: string="";
  public formapago: string="";
  public observacion: string="";

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    //this.idOrden=navParams.get("qtity");
    //console.log(navParams.get('idOrder'));

    this.idOrden=navParams.get('idOrder');
    this.direccion=navParams.get('textdire');
    this.formapago=navParams.get('metodo');
    this.observacion=navParams.get('observ');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderResumenPage');
  }

  Gotohome(){
    const loading = this.loadingCtrl.create({
      //spinner: 'hide',
      spinner:"bubbles",
      content: 'Por favor espere...'
    });
  
    loading.present();
  
    setTimeout(() => {
      location.reload();
    }, 3000);
    
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

  }

}
