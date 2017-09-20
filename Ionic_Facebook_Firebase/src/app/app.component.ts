import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';


import { CartPage } from '../pages/cart/cart';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrdersPage } from '../pages/orders/orders';
import { SettingsPage } from '../pages/settings/settings';
import { SupportPage } from '../pages/support/support';
import { Vibration } from '@ionic-native/vibration';

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  
  pages: Array<{title: string, component: any}>;
  imagen : any;
  usuario: any;
/*   total_qty : any;
  public carrito: FirebaseListObservable<any>; */

  constructor(public vibration: Vibration,public loadingCtrl: LoadingController,platform: Platform, private afAuth: AngularFireAuth, private statusBar: StatusBar, 
    private splashscreen: SplashScreen, public afd: AngularFireDatabase ) {
    this.afAuth.authState.subscribe(auth => {
      //this.imagen = "";
      //this.usuario="";
      
      this.presentLoading();
      try
      {
      if (!auth)
        this.rootPage = LoginPage;        
      else
        this.rootPage = HomePage;
        this.imagen = auth.photoURL;
        this.usuario = auth.displayName;
        /* this.carrito = this.afd.list('/cart/'+auth.uid);
        this.carrito.subscribe(carrrr =>{
          this.total_qty=0;
          for (var i = 0; i < carrrr.length; i++) {
            this.total_qty += carrrr[i].item_qty;            
          }                    
        });  */       
      }
      catch(e){}
      
    //It Works
     //this.vibration.vibrate(1000);

    });
    platform.ready().then(() => {
      splashscreen.hide();
    });

    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Productos', component: HomePage },
      //{ title: 'Carrito', component: CartPage  },      
      { title: 'Mis Pedidos', component: OrdersPage },
      { title: 'Configuración', component: SettingsPage },
      { title: 'Soporte', component: SupportPage }      
    ];
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "¡Espere por favor!",
      duration: 500
    });
    loader.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  };

  async logout(){
    firebase.auth().signOut();
    this.nav.push(LoginPage);
    //window.location.reload();
  };
  /* goCart(){
    this.nav.push(CartPage);
  }; */
}
