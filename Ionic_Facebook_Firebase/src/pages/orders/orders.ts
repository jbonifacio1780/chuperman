import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';

@Component({
    selector: 'orders-home',
    templateUrl: 'orders.html'
  })
  export class OrdersPage {
    public ordenes: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public NavParams: NavParams,public afd: AngularFireDatabase, public afAuth: AngularFireAuth ) {
        try{
          this.afAuth.authState.subscribe(auth => {      
          
            this.afd.database.ref('/orders/').orderByChild('UserId').startAt(firebase.auth().currentUser.uid).endAt(firebase.auth().currentUser.uid)
            .once('value', function (snapshot) {             
             console.log(snapshot);
            });                          
        })       

      }catch (e){}   
    }
}