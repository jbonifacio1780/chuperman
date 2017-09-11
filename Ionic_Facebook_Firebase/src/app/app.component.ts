import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

import { CartPage } from '../pages/cart/cart';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrdersPage } from '../pages/orders/orders';
import { SettingsPage } from '../pages/settings/settings';
import { SupportPage } from '../pages/support/support';

import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = HomePage;
  
  pages: Array<{title: string, component: any}>;
  imagen : any;
  usuario: any;

  constructor(platform: Platform, private afAuth: AngularFireAuth, private statusBar: StatusBar, private splashscreen: SplashScreen, public afd: AngularFireDatabase ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth)
        this.rootPage = LoginPage;
      else
        this.rootPage = HomePage;
        this.imagen = auth.photoURL;
        this.usuario = auth.displayName
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashscreen.hide();
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Product', component: HomePage },
      { title: 'My Carts', component: CartPage  },      
      { title: 'My Orders', component: OrdersPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Support', component: SupportPage }      
    ];
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  };

  async logout(){
    firebase.auth().signOut();
    this.nav.push(LoginPage);
    window.location.reload();
  }
}
