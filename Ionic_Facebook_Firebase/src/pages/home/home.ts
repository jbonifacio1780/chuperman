import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import { CartPage } from '../cart/cart'
import { NavController , NavParams } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/* import { Http } from '@angular/http'; */

import { DetailsPage } from '../details/details';
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

    this.cart = this.afd.list('/cart/');
    this.productos = this.afd.list('/productos');     
        
    this.productos.subscribe(queriedItems => {
      this.listado= queriedItems;
      console.log(queriedItems); 
      
   }); 

  }

  toggleSection(i) {         
     this.listado[i].open = !this.listado[i].open;
  }

    
    navigate(){
      this.navCtrl.push(DetailsPage,{
        firstPassed: "1",
        SecondPassed: "2",
      })
    }

    goCart(){
      this.navCtrl.push(CartPage,{});
    }

    addToCart(item, id){            
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
