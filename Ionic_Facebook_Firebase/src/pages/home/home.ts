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

    
    navigateCart(){
      this.navCtrl.push(CartPage,{

      })
    }

    goCart(){
      this.navCtrl.push(CartPage,{});
    }
  
    /* addToCart(item, nivel1:string, nivel2:string){
      this.productChild = this.afd.list('/productos/'+nivel1+'/children/'+nivel2);      
      this.productChild.subscribe(produchild => {        
        console.log('produc',produchild);       
     });                 
      this.afd.database.ref('/cart').child(firebase.auth().currentUser.uid).child(nivel1+'-'+nivel2).set({    // set
        item_description: item.descripcion,
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      });
    }; */

    openFabButton(){
      if(this.fabButtonOpened==false){
          this.fabButtonOpened=true;
      }else{
          this.fabButtonOpened=false;
      }
    }

        //Add to Cart
        cartadd(item, nivel1, nivel2) {          
          this.afd.database.ref('/cart').child(firebase.auth().currentUser.uid).once("value", function(snapshot) {    
            if( snapshot.hasChild(nivel1+'-'+nivel2) == true){    
              //if item is already in the cart
              //console.log(snapshot.key);            
              var currentQty = snapshot.child(nivel1+'-'+nivel2).val().item_qty;  
              var currentPrice = snapshot.child(nivel1+'-'+nivel2).val().item_price;  
              console.log(currentQty);  
              snapshot.child(nivel1+'-'+nivel2).ref.update({item_qty : currentQty+1, item_price: currentPrice+item.precio })                 
            }else{    
              //if item is new in the cart
              snapshot.child(nivel1+'-'+nivel2).ref.set({    // set
                item_description: item.descripcion,
                item_name: item.nombre,
                item_image: item.image,
                item_price: item.precio,
                item_qty: 1
              });
            }
          });
        };
}
