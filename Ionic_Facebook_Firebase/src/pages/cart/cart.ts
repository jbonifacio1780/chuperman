import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, Platform  } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import {CheckOutPage} from '../checkout/checkout'

/* import * as firebase from 'firebase/app'; */
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import 'rxjs/add/operator/map';



@Component({
    selector: 'cart-home',
    templateUrl: 'cart.html'
  })
  export class CartPage {
   
    public carts: FirebaseListObservable<any>;
    public cartsdetails: FirebaseListObservable<any>;
    public userid:any;
    carrito: any;
    key: any;
    currentPrice: any;

    constructor
    (private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, public afAuth: AngularFireAuth, public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public platform: Platform, ) {
      this.userid= afAuth.auth.currentUser.uid;
      this.carts = this.afd.list('/cart/'+this.userid+'/');
      this.carts.subscribe(nuevo =>{
        console.log(nuevo);
        this.currentPrice=0;
        for (var i = 0; i < nuevo.length; i++) {
          this.currentPrice += nuevo[i].item_price;            
        }
      });
    }

    inc(id){
      console.log(id.$key);
    
      this.afd.database.ref('/cart').child(this.userid).once("value", function(snapshot) {
        if( snapshot.hasChild(id.$key) == true ){

          var currentQty = snapshot.child(id.$key).val().item_qty;
          //check if currentQty+1 is less than available stock
          
          this.carts.child(id.$key).update({
            item_qty : currentQty+1
          });

        }else{
          console.log('Error');
        }
      });
    };

    decrementQty(carrito){
      this.key = carrito.$key;            
      var currentQty = carrito.item_qty-1;
      var currentPrecio = carrito.item_price/carrito.item_qty;  
      if (currentQty > 0){
      this.afd.database.ref('/cart').child(this.userid).child(this.key).update({item_qty : currentQty,item_price:currentPrecio*currentQty}).then(data=>{
        console.log("Else Loop");
      }, error => {
        console.log(error);
      });}
    }

    incrementQty(carrito) {      
      this.key = carrito.$key;            
      var currentQty = carrito.item_qty+1;
      var currentPrecio = carrito.item_price/carrito.item_qty;  
      this.afd.database.ref('/cart').child(this.userid).child(this.key).update({item_qty : currentQty,item_price:currentPrecio*currentQty}).then(data=>{
        console.log("Else Loop");
      }, error => {
        console.log(error);
      });
    };

    DeleteItem(carrito) {      
      this.key = carrito.$key;                  
      this.afd.database.ref('/cart').child(this.userid).child(this.key).remove().then(data=>{
        console.log("eliinado");
      }, error => {
        console.log(error);
      });
    };

    presentActionSheet(carrito) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Confirmar Eliminar',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.DeleteItem(carrito);
              console.log('Destructive clicked');
            }
          },{
            text: 'Cancelar',
            role: 'cancel',            
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }

    showPrompt(cart) {
      let prompt = this.alertCtrl.create({
        title: 'Opciones',
        message: "Agregar , Quitar + Eliminar",        
        inputs: [
          {
            name: 'Nombre',            
            value: cart.item_qty            
          },
        ],
        buttons: [
          {
            text: '-',
            handler: data => {
              console.log('Cancel clicked');
            },
            cssClass: 'alertDanger'
          },
          {
            text: '+',
            handler: data => {              
              console.log(data);
            }
          }
        ]
      });
      prompt.present();
    };

    gotoCheckOut(){
      this.navCtrl.push(CheckOutPage,{});
    }; 
  }