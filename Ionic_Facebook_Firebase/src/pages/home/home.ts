import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import { CartPage } from '../cart/cart'
import { NavController , NavParams } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
<<<<<<< HEAD
/* import { Http } from '@angular/http'; */

=======

import 'rxjs/add/operator/map';
>>>>>>> 45b239ae1e6b2119aeeda4c0cd10f8ac0ee46892
import { DetailsPage } from '../details/details';
import { CartPage } from '../cart/cart';

import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/map';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  fabButtonOpened: Boolean;

public productos: FirebaseListObservable<any>;
public image_x="";
public cart: FirebaseListObservable<any>;
public listado : any[];
public currentUser:AngularFireAuth;


  constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase,public navParams: NavParams, public afAuth: AngularFireAuth) {     
    this.fabButtonOpened=false;

<<<<<<< HEAD
    this.cart = this.afd.list('/cart/');
    this.productos = this.afd.list('/productos');     
        
=======
constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, public afAuthx: AngularFireAuth ) {
  //let userid= firebase.auth().currentUser.uid;

    //this.cart = this.afd.list('/cart/'+'1dVZxv7jSTW4hsRVU6grNXY2iXX2'+'/');
    this.productos = this.afd.list('/productos');     
>>>>>>> 45b239ae1e6b2119aeeda4c0cd10f8ac0ee46892
    this.productos.subscribe(queriedItems => {
      this.listado= queriedItems;
      console.log(queriedItems); 
      
   }); 

  }

  toggleSection(i) {         
     this.listado[i].open = !this.listado[i].open;
  }

    
    navigateCart(){
      this.navCtrl.push(CartPage,{

      })
    }

    goCart(){
      this.navCtrl.push(CartPage,{});
    }
  
    addToCart(item){
      //let num= this.cart.$ref.ref.key.indexOf.length;
      this.afd.database.ref('/cart').child(firebase.auth().currentUser.uid).push({    // set
        item_description: item.descripcion,
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      });
    }
    
    openFabButton(){
      if(this.fabButtonOpened==false){
          this.fabButtonOpened=true;
      }else{
          this.fabButtonOpened=false;
      }
    };
}
