import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';


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

    constructor(public navCtrl: NavController, public NavParams: NavParams,  public afd: AngularFireDatabase, public afAuth: AngularFireAuth, public alertCtrl: AlertController ) {
      this.userid= afAuth.auth.currentUser.uid;
      this.afd.database.ref('/users/').once("value", function(snapshot) {    
        if( snapshot.hasChild(firebase.auth().currentUser.uid) == true){
        }
        else{
          snapshot.child(firebase.auth().currentUser.uid).ref.set({email:firebase.auth().currentUser.email,telephone:""})
        }
      })
      
      this.address = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/address'); 
      this.address.subscribe(lista =>{
        console.log(lista);
      });
      
      this.users = this.afd.list('/users/'+firebase.auth().currentUser.uid); 
      this.users.subscribe(lista =>{
        this.telephone = lista[1].$value
        this.email = lista[2].$value;       
      });        
      this.imagen = afAuth.auth.currentUser.photoURL;
      this.Usuario= afAuth.auth.currentUser.displayName;    
    }
    
    Nuevo() {
      let prompt = this.alertCtrl.create({
        title: 'Editar Dirección',
        
        inputs: [
          {
            name: 'address',
            placeholder: 'Dirección'
            
          },
          {
            name: 'nickname',
            placeholder: 'NickName'
            
          },
          {
            name: 'phone',
            placeholder: 'phone'
           
          },
          {
            name: 'pin',
            placeholder: 'pin'
            
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.NewRecord(data);
              //console.log(data);
            }
          }
        ]
      });
      prompt.present();
    };


    Editar(address) {
      let prompt = this.alertCtrl.create({
        title: 'Editar Dirección',
        
        inputs: [
          {
            name: 'address',
            placeholder: 'Dirección',
            value: address.address
          },
          {
            name: 'nickname',
            placeholder: 'NickName',
            value: address.nickname
          },
          {
            name: 'phone',
            placeholder: 'phone',
            value: address.phone
          },
          {
            name: 'pin',
            placeholder: 'pin',
            value: address.pin
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.SaveEditar(data,address);
              //console.log(data);
            }
          }
        ]
      });
      prompt.present();
    };

    Eliminar(address) {
      let prompt = this.alertCtrl.create({
        title: 'Eliminar!!',
        message: "Esta Seguro de Eliminar?",
        
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: () => {
              this.DeleteRecord(address);
              //console.log(data);
            }
          }
        ]
      });
      prompt.present();
    }

    SaveEditar(data,address){
      this.address.update(address.$key,{
        address:data.address,
        nickname: data.nickname,
        phone: data.phone,
        pin:data.pin
      }).then(data=>{
        console.log("Actualizado");
      }, error => {
        console.log(error);
      });      
    };

    DeleteRecord(data){     
      this.address.remove(data.$key).then(data=>{
        console.log("eliminado");
      }, error => {
        console.log(error);
      });             
    }

    NewRecord(data){
      this.address.push({
        address:data.address,
        nickname: data.nickname,
        phone: data.phone,
        pin:data.pin
      }).then(data=>{
        console.log("Registrado");
      }, error => {
        console.log(error);
      });      
    };
    nuevodato(){
      this.afd.database.ref('/users/').once("value", function(snapshot) {    
        if( snapshot.hasChild(firebase.auth().currentUser.uid) == true){
        }
        else{
          snapshot.child(firebase.auth().currentUser.uid).ref.set({email:firebase.auth().currentUser.email,telephone:""})
        }
      })
    }
}