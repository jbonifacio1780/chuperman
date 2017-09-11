import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'cart-home',
    templateUrl: 'cart.html'
  })
  export class CartPage {
      

    constructor(public navCtrl: NavController, public NavParams: NavParams ) {
        
    }
}