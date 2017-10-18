import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
  })
export class CheckoutPage {
      
////
  
payments : any;
public direcciones: FirebaseListObservable<any>; 
public carts: FirebaseListObservable<any>;
public orders: FirebaseListObservable<any>;
public cantidad: any;


    constructor(public navCtrl: NavController, public NavParams: NavParams, public afd: AngularFireDatabase, public afAuth: AngularFireAuth, public alertCtrl: AlertController ) {
        try{
            this.payments = [
                {id: 'EFECTIVO', name: 'EFECTIVO'},
                {id: 'VISA', name: 'VISA'},
                {id: 'MASTERCARD', name: 'MASTERCARD'}            
              ];

            this.afAuth.authState.subscribe(auth => {      
            this.direcciones = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/xaddress/'); 
            this.direcciones.subscribe(lista =>{
              console.log(lista);                    
            });                    
          })
          this.orders = this.afd.list('/orders/'+firebase.auth().currentUser.uid);
          this.orders.subscribe(total =>{
            console.log('orders',total);
            console.log(total.length);
            this.cantidad=total.length;

          }) 
          this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
          this.carts.subscribe(nuevo =>{
            console.log(nuevo);                        
          });

        }catch (e){}        
    }
    presentAlert() {
        const alert = this.alertCtrl.create({
          title: 'Aviso!',
          subTitle: 'Debe Seleecionar una dirección y un tipo de pago',
          buttons: ['Volver']
        });
        alert.present();
      }

    guardarOrder(payment, address){
        if(address==null || payment==null){
            this.presentAlert();                        
          }
          else {
            this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
            this.carts.subscribe(nuevo =>{
              this.afd.database.ref('/orders').child(firebase.auth().currentUser.uid).child(this.cantidad+1).set({
                Fecha:new Date().toLocaleDateString() +' '+ new Date().toLocaleTimeString(),
                Estado: "Solicitado"
              })
                for (var i = 0; i < nuevo.length; i++) {                   
                    this.afd.database.ref('/orders/').child(firebase.auth().currentUser.uid).child(this.cantidad+1).child(i.toString()).set(
                      {                                            
                        'product': nuevo[i].item_name,
                        'produc_img' : nuevo[i].item_image,
                        'produc_des' : nuevo[i].item_description,
                        'price':nuevo[i].item_price,
                        'qty' : nuevo[i].item_qty,
                        'payment' : payment,
                        'adress_id': address,
                        'cliente': firebase.auth().currentUser.displayName,
                        'userId': firebase.auth().currentUser.uid,
                        'status':'SOLICITADO'
                    })                   
                }
                this.carts.remove();
                this.gotoHome();
            });
          }

    }

    gotoHome(){
        //this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(HomePage);
        location.reload();               
      }; 
      
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

      NewRecord(data){
        this.direcciones.push({
          address:data.address,
          reference : data.reference
        }).then(data=>{
          console.log("Registrado");
        }, error => {
          console.log(error);
        });      
      }
}