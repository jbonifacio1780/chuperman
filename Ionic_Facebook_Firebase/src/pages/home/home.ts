import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import { NavController , NavParams } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DetailsPage } from '../details/details';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLogged: boolean;
/* menu: FirebaseListObservable<any>;
category: FirebaseListObservable<any>; */
public productos: FirebaseListObservable<any>;
public cart: FirebaseListObservable<any>;
/* shownGroup = null;
typeFilter: any;
information: any[]; */
public image_x="";

public listado : any[];


  constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, private http: Http,public navParams: NavParams) {
 /*    let localData = http.get('assets/information.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    })
    this.category = this.afd.list('/category');   
    this.menu = this.afd.list('/menu'); */       

    this.productos = this.afd.list('/productos');     
    this.cart = this.afd.list('/cart/'+'1dVZxv7jSTW4hsRVU6grNXY2iXX2'+'/');     
    this.productos.subscribe(queriedItems => {
      this.listado= queriedItems;
      console.log(queriedItems); 
      
   }); 

  }

  


/* 
  ionViewLoaded() {
    let rowNum = 0; //counter to iterate over the rows in the grid
    for (let i = 0; i < this.listado.length; i+=2) { //iterate images
      this.grid[rowNum] = Array(2); //declare two elements per row
      if (this.images[i]) { //check file URI exists
        this.grid[rowNum][0] = this.images[i] //insert image
      }
      if (this.images[i+1]) { //repeat for the second image
        this.grid[rowNum][1] = this.images[i+1]
      }
      rowNum++; //go on to the next row
    }
  }*/



  toggleSection(i) {         
     this.listado[i].open = !this.listado[i].open;
  }

    
    navigate(){
      this.navCtrl.push(DetailsPage,{
        firstPassed: "1",
        SecondPassed: "2",
      })
    }

    showProductInfo(id){
      console.log(id);
        }
    
    addToCart(item){
      //let num= this.cart.$ref.ref.key.indexOf.length;
     
      
      this.afd.database.ref('/cart').child(firebase.auth().currentUser.uid).push({    // set
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      });
    }

      /* this.afd.database.ref('/cart').child(firebase.auth().currentUser.uid).push({
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      }).key; */
      
      //firebaseApp.database().ref('/words/word1/')
      /* this.cart.push('').ref('ddd').child('item/').push({
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      }).key; */
      /* this.cart.push({
        item_name: item.nombre,
        item_image: item.image,
        item_price: item.precio,
        item_qty: 1
      }); */

    addToCart111(item) {
      var uid ;// uid is temporary user_id
      
          var cart={}; // the main Object
      
      
          //Check if user already logged in
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              uid=user.uid;
              cart = this.afd.database.ref().child(uid).$id;
            }
          });

      //check if item is already added or not
      this.afd.database.ref().child(firebase.auth().currentUser.uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.$id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.$id).val().item_qty;

          this.afd.database.ref().child(firebase.auth().currentUser.uid).child(item.$id).update({   // update
            item_qty : currentQty+1
          });

        }else{

          //if item is new in the cart
          this.afd.database.ref().child(firebase.auth().currentUser.uid).child(item).push({    // set
            item_name: item.nombre,
            item_image: item.image,
            item_price: item.precio,
            item_qty: 1
          });
        }
      });
    };
}
