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
    public hijo: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public NavParams: NavParams,public afd: AngularFireDatabase, public afAuth: AngularFireAuth ) {
        try{
          this.afAuth.authState.subscribe(auth => {      
            this.ordenes = this.afd.list('/orders/'+firebase.auth().currentUser.uid)
            this.ordenes.subscribe(orden => {
              console.log("1"+orden);                            
            })    
            this.afd.database.ref('/orders').child(firebase.auth().currentUser.uid).once("value", function(snapshot) {
              console.log(snapshot.val());              
              console.log(snapshot.numChildren());
            });        
            /* this.afd.database.ref('/orders/'+firebase.auth().currentUser.uid+'/1/')
            .once('value', function (snapshot) {             
             console.log(snapshot.val());             
             this.ordenes = snapshot.val();
             console.log(this.ordenes);             
            }); */                          
        })       
      }catch (e){}   
    }
}