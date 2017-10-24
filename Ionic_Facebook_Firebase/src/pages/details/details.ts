import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'; 
//import { HomePage } from '/home/home';


@Component({
    selector: 'details-home',
    templateUrl: 'details.html'
  })
  export class DetailsPage {
      public firstParam;
      public secondParam;

    constructor(public navCtrl: NavController, public NavParams: NavParams ) {
        this.firstParam = NavParams.get("firstPassed")
        this.secondParam = NavParams.get("SecondPassed")
    }
    ionViewDidLoad(){
        console.log('Se mostro otra Pagina');
    }

    goBack(){
        console.log('Popping');
        this.navCtrl.pop();
    }
  }