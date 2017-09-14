import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import 'rxjs/add/operator/map';



@Component({
    selector: 'cart-home',
    templateUrl: 'cart.html'
  })
  export class CartPage {
   
    public cart: FirebaseListObservable<any>;

    constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, public afAuth: AngularFireAuth ) {
      let userid= afAuth.auth.currentUser.uid;
      this.cart = this.afd.list('/cart/'+userid+'/');    
    }
}