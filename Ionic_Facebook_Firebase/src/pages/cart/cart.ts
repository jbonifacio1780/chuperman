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
    public userid:any;
    constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, public afAuth: AngularFireAuth ) {
      this.userid= afAuth.auth.currentUser.uid;
      this.cart = this.afd.list('/cart/'+this.userid+'/');
      let uno= this.cart.subscribe(nuevo =>{
        console.log(nuevo);
      });
    }

    inc(id){
      console.log(id.$key);
    
      this.afd.database.ref('/cart').child(this.userid).once("value", function(snapshot) {
        if( snapshot.hasChild(id.$key) == true ){

          var currentQty = snapshot.child(id.$key).val().item_qty;
          //check if currentQty+1 is less than available stock
          this.afd.database.ref('/cart').child(this.userid).child(id.$key).update({
            item_qty : currentQty+1
          });

        }else{
          console.log('Error');
        }
      });
    }
}