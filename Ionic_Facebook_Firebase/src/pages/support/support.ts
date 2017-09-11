import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'support-home',
    templateUrl: 'support.html'
  })
  export class SupportPage {
      

    constructor(public navCtrl: NavController, public NavParams: NavParams ) {
        
    }
}