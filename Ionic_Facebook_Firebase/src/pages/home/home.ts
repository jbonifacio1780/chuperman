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

    

}
