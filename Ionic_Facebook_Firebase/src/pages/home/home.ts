import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import { NavController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
isLogged: boolean;
menu: FirebaseListObservable<any>;

  constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase) {
     this.menu = this.afd.list('/menu');    
  }
  

logout1() {
   this.facebook.logout().then((response) =>{
     alert(JSON.stringify(response));
     this.isLogged = false;
   }, (error) => {
     alert(error);
   })
 }
  async logout(){
    firebase.auth().signOut();
    this.navCtrl.push(LoginPage);
    
  }
}
