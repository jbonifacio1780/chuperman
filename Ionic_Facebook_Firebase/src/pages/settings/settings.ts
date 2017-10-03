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
    nombre:any;
    apellido:any;
    pin:any;

    constructor(public navCtrl: NavController, public NavParams: NavParams,  public afd: AngularFireDatabase, public afAuth: AngularFireAuth, public alertCtrl: AlertController ) {
      try{
      this.afAuth.authState.subscribe(auth => {      
      this.address = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/xaddress/'); 
      this.address.subscribe(lista =>{
        console.log(lista);
      });      
      this.users = this.afd.list('/users/'+firebase.auth().currentUser.uid);     
      this.users.subscribe(lista =>{       
        this.apellido = lista[0].$value;
        this.email = lista[1].$value;
        this.nombre = lista[2].$value;
        this.pin = lista[3].$value;
        this.telephone = lista[4].$value;
      });        
      this.imagen = afAuth.auth.currentUser.photoURL;
      this.Usuario= afAuth.auth.currentUser.displayName;    
    })    
  }catch (e){}
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
            name: 'reference',
            placeholder: 'reference'
            
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
            name: 'reference',
            placeholder: 'reference',
            value: address.reference
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
            text: 'Eliminar',
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
        reference : data.reference
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
        reference : data.reference
      }).then(data=>{
        console.log("Registrado");
      }, error => {
        console.log(error);
      });      
    }
    
    updateData(nombre,apellido,telefono,email,pin){
      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {nombres:nombre});      
      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {apellidos:apellido});      
      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {telephone:telefono});      
      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {email:email});      
      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {pin:pin});      
    }
}