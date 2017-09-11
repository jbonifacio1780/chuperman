import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { LoginPage } from '../login/login'
import { NavController } from 'ionic-angular';
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

/* shownGroup = null;
typeFilter: any;
information: any[]; */
public listado : any[];


  constructor(private facebook: Facebook ,public navCtrl: NavController, public afd: AngularFireDatabase, private http: Http) {
 /*    let localData = http.get('assets/information.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    })
    this.category = this.afd.list('/category');   
    this.menu = this.afd.list('/menu'); */   
    this.productos = this.afd.list('/productos');     
    this.productos.subscribe(queriedItems => {
      this.listado= queriedItems;
      console.log(queriedItems); 
      
    }); 

  }
  

/* logout1() {
   this.facebook.logout().then((response) =>{
     alert(JSON.stringify(response));
     this.isLogged = false;
   }, (error) => {
     alert(error);
   })
 } */

/*   async logout(){
    firebase.auth().signOut();
    this.navCtrl.push(LoginPage);
    
  } */

  toggleSection(i) {         
     this.listado[i].open = !this.listado[i].open;
  }
 
  /* toggleItem(i, j) {
    this.listado[i].children[j].open = !this.listado[i].children[j].open;
  } */
    
    navigate(){
      this.navCtrl.push(DetailsPage,{
        firstPassed: "1",
        SecondPassed: "2",
      })
    }

}
