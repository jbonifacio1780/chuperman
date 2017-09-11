import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'orders-home',
    templateUrl: 'orders.html'
  })
  export class OrdersPage {
      

    constructor(public navCtrl: NavController, public NavParams: NavParams ) {
        
    }
}