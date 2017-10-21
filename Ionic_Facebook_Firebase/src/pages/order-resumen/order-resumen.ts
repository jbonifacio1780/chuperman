import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderResumenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-resumen',
  templateUrl: 'order-resumen.html',
})
export class OrderResumenPage {

  public idOrden: string="";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.idOrden=navParams.get("qtity");
    console.log(navParams.get('idOrder'));

    this.idOrden=navParams.get('idOrder');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderResumenPage');
  }

  Gotohome(){
    location.reload();
  }
}
