import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, Platform  } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import {CheckoutPage} from '../checkout/checkout'

/* import * as firebase from 'firebase/app'; */
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import 'rxjs/add/operator/map';



@Component({
    selector: 'cart-home',
    templateUrl: 'cart.html'
  })
  export class CartPage {
   
    public carts: FirebaseListObservable<any>;
    public cartsdetails: FirebaseListObservable<any>;
    public userid:any;
    carrito: any;
    key: any;
    currentPrice: any;
    qty : any;
    direccion : string = "";
    public weekday = Array(7);
    constructor
    (private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, public afAuth: AngularFireAuth, public alertCtrl: AlertController,public navParams: NavParams,public actionSheetCtrl: ActionSheetController,public platform: Platform ) {
      try{

      
       this.afAuth.authState.subscribe(auth => {
        this.weekday[0] =  "Domingo";
        this.weekday[1] = "Lunes";
        this.weekday[2] = "Martes";
        this.weekday[3] = "Miercoles";
        this.weekday[4] = "Jueves";
        this.weekday[5] = "Viernes";
        this.weekday[6] = "Sabado";

        this.userid= afAuth.auth.currentUser.uid;      
        this.carts = this.afd.list('/cart/'+this.userid+'/');
        this.carts.subscribe(nuevo =>{
        console.log(nuevo);
        this.currentPrice=0;
        this.direccion=navParams.get("direccion"); 
        this.qty=0;
        for (var i = 0; i < nuevo.length; i++) {
          this.currentPrice += nuevo[i].item_price;  
          this.qty += nuevo[i].item_qty;          
        }
      });
    })    
  }catch (e){}
    }

    inc(id){
      console.log(id.$key);
    
      this.afd.database.ref('/cart').child(this.userid).once("value", function(snapshot) {
        if( snapshot.hasChild(id.$key) == true ){

          var currentQty = snapshot.child(id.$key).val().item_qty;
          //check if currentQty+1 is less than available stock
          
          this.carts.child(id.$key).update({
            item_qty : currentQty+1
          });

        }else{
          console.log('Error');
        }
      });
    };

    decrementQty(carrito){
      this.key = carrito.$key;            
      var currentQty = carrito.item_qty-1;
      var currentPrecio = carrito.item_price/carrito.item_qty;  
      if (currentQty > 0){
      this.afd.database.ref('/cart').child(this.userid).child(this.key).update({item_qty : currentQty,item_price:currentPrecio*currentQty}).then(data=>{
        console.log("Else Loop");
        navigator.vibrate(50);
      }, error => {
        console.log(error);
      });}
    }

    incrementQty(carrito) {      
      this.key = carrito.$key;            
      var currentQty = carrito.item_qty+1;
      var currentPrecio = carrito.item_price/carrito.item_qty;  
      this.afd.database.ref('/cart').child(this.userid).child(this.key).update({item_qty : currentQty,item_price:currentPrecio*currentQty}).then(data=>{
        console.log("Else Loop");
        navigator.vibrate(50);
      }, error => {
        console.log(error);
      });
    };

    DeleteItem(carrito) {      
      this.key = carrito.$key;                  
      this.afd.database.ref('/cart').child(this.userid).child(this.key).remove().then(data=>{
        console.log("eliminado");
      }, error => {
        console.log(error);
      });
    };

    RemoveAll() {
      const alert = this.alertCtrl.create({
        title: 'Eliminar todo',
        subTitle:'¿Está usted seguro(a) de eliminar el carrito?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Si',
            handler: () => {
              this.afd.database.ref('/cart').child(this.userid).remove().then(data=>{
                console.log("eliminado");
              }, error => {
                console.log(error);
              });
              console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
    }

    presentActionSheet(carrito) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Confirmar Eliminar',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.DeleteItem(carrito);
              console.log('Destructive clicked');
            }
          },{
            text: 'Cancelar',
            role: 'cancel',            
            icon: !this.platform.is('ios') ? 'close' : null,
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }

    showPrompt(cart) {
      let prompt = this.alertCtrl.create({
        title: 'Opciones',
        message: "Agregar , Quitar + Eliminar",        
        inputs: [
          {
            name: 'Nombre',            
            value: cart.item_qty            
          },
        ],
        buttons: [
          {
            text: '-',
            handler: data => {
              console.log('Cancel clicked');
            },
            cssClass: 'alertDanger'
          },
          {
            text: '+',
            handler: data => {              
              console.log(data);
            }
          }
        ]
      });
      prompt.present();
    };

    AlertCart() {
      const alert = this.alertCtrl.create({
        title: 'Advertencia',
        subTitle: 'Debe escoger al menos un producto, el valor minimo de compra es de S/.35',
        buttons: ['Ok'],
        cssClass:'alertCustomCss'
      });
      alert.present();
    }

    gotoCheckOut(){      
      if (this.qty>0 && this.currentPrice>=35){
      this.navCtrl.push(CheckoutPage,{direccion: this.direccion});
      }else{
        this.AlertCart();
      }      
    }
    
    horario(){
      var d = new Date();                
      var n = this.weekday[d.getDay()];
      var t = d.toLocaleTimeString()
      console.log(n);
      console.log(t);
      /* if(n =='Martes' && t >= "22:00:00" && t <= "4:00:00"){
        console.log("OK");
      } */
      switch (n) {
        case 'Domingo':
          if(t >= "22:00:00" || t <= "4:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }
        break;
        case 'Lunes':
          if(t >= "22:00:00" || t <= "4:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }            
          break;
        case 'Martes':
          if(t >= "22:00:00" || t <= "4:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }
          break;
        case 'Miercoles':
          if(t >= "22:00:00" || t <= "4:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }
          break;
        case 'Jueves':
          if(t >= "22:00:00" || t <= "4:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }
          break;
        case 'Viernes':
          if(t >= "19:00:00" || t <= "5:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 19 a 05 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 19 a 05 am");
          }
          break;
        case 'Sabado':
          if(t >= "19:00:00" || t <= "5:00:00"){
            console.log("OK pase a checkout" +' - '+ n);
            this.gotoCheckOut();
          }
          else{
            alert("De domingo a Jueves el Horario de atencioon es de 19 a 05 am");
            console.log("De domingo a Jueves el Horario de atencioon es de 22 a 04 am");
          }
          break;          
    }
  }

  }