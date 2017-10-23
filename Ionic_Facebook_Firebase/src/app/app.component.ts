import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,LoadingController } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

//import { ScreenOrientation } from '@ionic-native/screen-orientation';
//import { CartPage } from '../pages/cart/cart';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrdersPage } from '../pages/orders/orders';
//import { CheckoutPage } from '../pages/checkout/checkout';
import { SettingsPage } from '../pages/settings/settings';
//import { SupportPage } from '../pages/support/support';
import { Vibration } from '@ionic-native/vibration';

import { GooglemapPage } from '../pages/Googlemap/Googlemap';
//import { MapComponent } from '../components/map/map';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  //tabBarElement: any;
  splash = true;
  //secondPage = LoginPage;

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  
  pages: Array<{
    title: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;
    tabComponent?: any;
  }>;
  imagen : any;
  usuario: any;
/*   total_qty : any;
  public carrito: FirebaseListObservable<any>; */

  constructor(public vibration: Vibration,public loadingCtrl: LoadingController,platform: Platform, private afAuth: AngularFireAuth, 
    public SplashScreen:SplashScreen,
    public afd: AngularFireDatabase) {

      SplashScreen.hide();
      
    //this.tabBarElement = document.querySelector('.tabbar');

    
/*PARA MOSTRAR EL SPLASHCREEN NUEO ANIMADO
    setTimeout(() => {
      this.splash = false;
    }, 6000);
*/
    this.afAuth.authState.subscribe(auth => {
      try
      {
      if (!auth)
        this.rootPage = LoginPage;        
      else

        this.rootPage = GooglemapPage;
      
        this.imagen = auth.photoURL;
        this.usuario = auth.displayName;

      }
      catch(e){}
      

    });
    platform.ready().then(() => {
      
    });

    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Ubicación', component: GooglemapPage, index: 1, icon: 'map' },
      { title: 'Productos', component: HomePage, index: 2, icon: 'pricetag' },
      //{ title: 'Carrito', component: CartPage  },      
      { title: 'Mis Pedidos', component: OrdersPage, index: 3, icon: 'basket'  },
      { title: 'Terminos y Condiciones', component: SettingsPage, index: 4, icon: 'information-circle'  },
      { title: 'Configuración', component: SettingsPage, index: 5, icon: 'settings'  }
      //{ title: 'Soporte', component: SupportPage }      
    ];
  }


 


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "¡Espere por favor!",
      duration: 200
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
