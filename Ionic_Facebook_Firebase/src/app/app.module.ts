import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { DetailsPage } from '../pages/details/details';

import { CartPage } from '../pages/cart/cart';
import { OrdersPage } from '../pages/orders/orders';
import { SettingsPage } from '../pages/settings/settings';
import { SupportPage } from '../pages/support/support';
import { CheckOutPage } from '../pages/checkout/checkout'



import { AngularFireModule } from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';


import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Vibration } from '@ionic-native/vibration';

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
    CartPage,
    OrdersPage,
    SettingsPage,
    SupportPage,
    CheckOutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    DetailsPage,
    CartPage,
    OrdersPage,
    SettingsPage,
    SupportPage,
    CheckOutPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    SplashScreen,
    Vibration,
    Facebook    
    ],
})
export class AppModule {}
