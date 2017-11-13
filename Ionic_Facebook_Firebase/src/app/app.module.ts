import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { DetailsPage } from '../pages/details/details';
import { TerminosPage } from '../pages/terminos/terminos';
import { CartPage } from '../pages/cart/cart';
import { OrdersPage } from '../pages/orders/orders';
import { SettingsPage } from '../pages/settings/settings';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { SupportPage } from '../pages/support/support';
import { CheckoutPage } from '../pages/checkout/checkout'
import { SearchPage } from '../pages/search/search';
import { OrderResumenPage } from '../pages/order-resumen/order-resumen';


import { GooglemapPage } from '../pages/Googlemap/Googlemap'

import { GeocoderService } from '../providers/map/geocoder.service';
import { MapService } from '../providers/map/map.service';
 

import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireModule } from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
//import { TwitterConnect } from '@ionic-native/twitter-connect';

import { MapComponent } from '../components/map/map';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Vibration } from '@ionic-native/vibration';

import { CallNumber } from '@ionic-native/call-number';

//import { Sim } from '@ionic-native/sim';
//import { AccordionComponent } from '../components/accordion/accordion';


var config = {
  apiKey: "AIzaSyBro1XKpMh30r2ApCnXiLMKbVmMQlWtaBo",
  authDomain: "chuperman-81140.firebaseapp.com",
  databaseURL: "https://chuperman-81140.firebaseio.com",
  projectId: "chuperman-81140",
  storageBucket: "chuperman-81140.appspot.com",
  messagingSenderId: "803987007948"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    DetailsPage,
    TerminosPage,
    CartPage,
    OrdersPage,
    SettingsPage,
    ConfiguracionPage,
    SupportPage,
    CheckoutPage,
    GooglemapPage,
    MapComponent,
    SearchPage,
    OrderResumenPage
    //,
    //AccordionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule//,
    //MapComponent
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    DetailsPage,
    TerminosPage,
    CartPage,
    OrdersPage,
    SettingsPage,
    ConfiguracionPage,
    SupportPage,
    CheckoutPage,
    GooglemapPage,
    //MapComponent,
    SearchPage,
    OrderResumenPage
  ],
  providers: [
    StatusBar,
    //SplashScreen,
    Vibration,
    Facebook,
    //Sim,
    //TwitterConnect,
    Geolocation,
    GeocoderService,
    MapService,
    CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
