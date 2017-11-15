import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,LoadingController,ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import {CheckoutPage} from '../checkout/checkout'

@Component({
    selector: 'settings-home',
    templateUrl: 'settings.html'
  })
  export class SettingsPage {
    public users: FirebaseListObservable<any>;   
    public address: FirebaseListObservable<any>;   
    public userid:any;
    telephone:any;
    email:any;
    imagen:any;
    Usuario:any;
    nombre:any;
    apellido:any;
    pin:any;

    constructor(
      public navCtrl: NavController, 
      public NavParams: NavParams,  
      public afd: AngularFireDatabase, 
      public afAuth: AngularFireAuth, 
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController ) {
      try{
      this.afAuth.authState.subscribe(auth => {      
      this.address = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/xaddress/'); 
      this.address.subscribe(lista =>{
        //console.log(lista);
      });      
      this.users = this.afd.list('/users/'+firebase.auth().currentUser.uid);     
      this.users.subscribe(lista =>{       
        this.apellido = lista[0].$value;
        this.email = lista[1].$value;
        this.nombre = lista[2].$value;
        this.pin = lista[4].$value;
        this.telephone = lista[5].$value;

        //console.log(lista);
      }); 

      this.imagen = afAuth.auth.currentUser.photoURL;
      try
      {
        this.Usuario= afAuth.auth.currentUser.displayName;    
      }
      catch (e){this.Usuario = this.apellido+ ' ' + this.nombre;}
    })    
  }catch (e){}
    }
    
  
    
    updateData(nombre,apellido,telefono,email,pin){

      const loading = this.loadingCtrl.create({
        //spinner: 'hide',
        spinner:"bubbles",
        content: 'Actualizando su información'
      });
    
      loading.present();
    
      setTimeout(() => {
        try
        {
          this.afd.list('/users/').update(firebase.auth().currentUser.uid, {nombres:nombre});      
          this.afd.list('/users/').update(firebase.auth().currentUser.uid, {apellidos:apellido});      
          this.afd.list('/users/').update(firebase.auth().currentUser.uid, {telephone:telefono});      
          this.afd.list('/users/').update(firebase.auth().currentUser.uid, {email:email});      
          this.afd.list('/users/').update(firebase.auth().currentUser.uid, {pin:pin});
          var nombrecompleto = this.nombre+" "+ this.apellido;
          var user = firebase.auth().currentUser;
          if (user.displayName=="" || user.displayName==null || user.displayName!=nombrecompleto )
          user.updateProfile({
            displayName: nombrecompleto //"https://firebasestorage.googleapis.com/v0/b/chuperman-81140.appspot.com/o/user-dummy-pic.png?alt=media&token=ea30d73b-edbe-4c7c-810a-b047fd9eb0e4"
          }).then(function() {
            // Update successful.
          }).catch(function(error) {
            // An error happened.
          });

         //firebase.auth().currentUser.displayName = this.nombre+ ' ' + this.apellido;
         //this.navCtrl.getPrevious(CheckoutPage);
         

        }
        catch (e){}
      }, 3000);
      
      setTimeout(() => {
        this.presentToast();
        loading.dismiss();
      }, 5000);
      
      this.navCtrl.pop();

    }

    Continuar(){
      this.navCtrl.pop();
      this.presentToast();
    }

    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Puede continuar con su Chuperpedido',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }     
}