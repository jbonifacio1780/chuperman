import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { NavController , NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoadingController } from 'ionic-angular';



import { DetailsPage } from '../details/details';
import { GooglemapPage } from '../Googlemap/Googlemap';
import { MapComponent } from '../../components/map/map';

import { AngularFireAuth } from 'angularfire2/auth';

import 'rxjs/add/operator/map';
import { Vibration } from '@ionic-native/vibration';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
fabButtonOpened: Boolean;
public direccion: string="";
public productos: FirebaseListObservable<any>;
public image_x="";
public cart: FirebaseListObservable<any>;
public listado : any[];
total_qty : any;
public carrito: FirebaseListObservable<any>;


  constructor(private facebook: Facebook,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public afd: AngularFireDatabase,
    public navParams: NavParams, 
    public afAuth: AngularFireAuth, 
    public alertCtrl:AlertController) 
  {     
    try{

      this.presentLoadingCustom();

      this.direccion=navParams.get("direccion");
      if(this.direccion==null||this.direccion=="")
      {
        this.AlertMap();
      }
      
      this.afAuth.authState.subscribe(auth => {
      this.fabButtonOpened=false;
      this.cart = this.afd.list('/cart/');
      this.productos = this.afd.list('/productos');             
      this.productos.subscribe(queriedItems => {
        this.listado= queriedItems;
        //console.log(queriedItems);   
      
      //console.log(this.direccion);
      
    });
    this.carrito = this.afd.list('/cart/'+auth.uid);
    this.carrito.subscribe(carrrr =>{
      this.total_qty=0;
      for (var i = 0; i < carrrr.length; i++) {
        this.total_qty += carrrr[i].item_qty;            
      }
      });

      this.afd.database.ref('/users/').once("value", function(snapshot) {    
        if( snapshot.hasChild(firebase.auth().currentUser.uid) == true){          
        }
        else{
          snapshot.child(firebase.auth().currentUser.uid).ref.set({email:"", telephone:"", nombres:"", apellidos:"", pin:""})
        }
      })
    })    
    }catch (e){}

}

presentLoadingCustom() {
  const loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Espere por favor',
    duration: 2000
  });

  loading.onDidDismiss(() => {
    //console.log('Dismissed loading');
  });

  loading.present();
}

  toggleSection(i) {         
     this.listado[i].open = !this.listado[i].open;
  }

    
    navigateCart(){
      this.navCtrl.push(CartPage,{

      })
    }

    goCart(){
      if (this.total_qty>0){
      this.navCtrl.push(CartPage,{direccion: this.direccion});
      }
      else{
        this.AlertCart();
      }
    }


    AlertCart() {
      const alert = this.alertCtrl.create({
        title: 'Advertencia',
        subTitle: 'Debe seleccionar al menos un producto',
        buttons: ['Ok']
      });
      alert.present();
    }

    AlertMap() {
      const alert = this.alertCtrl.create({
        title: 'Advertencia',
        message: 'Debe seleccionar una ubicación',
        buttons: [
          {
            text: 'OK',
            handler: () => {
             this.GotoMap();
            }
          }
        ]
      });
      alert.present();
      
    }

    GotoMap(){
      this.navCtrl.setRoot(GooglemapPage,{});
    }

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
            navigator.vibrate(50);
          });
        };
}
