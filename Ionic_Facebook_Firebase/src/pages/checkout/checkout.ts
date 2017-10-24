import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';
import { GooglemapPage } from '../Googlemap/Googlemap';
import { MapComponent } from '../../components/map/map';
import { OrderResumenPage } from '../order-resumen/order-resumen';

@Component({ 
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
  })
export class CheckoutPage {
      
////
  
payments : any;

regalocompra : any;
public direcciones: FirebaseListObservable<any>; 
public carts: FirebaseListObservable<any>;
public orders: FirebaseListObservable<any>;
public cantidad: any;
public direccion : string = "";
public direc: string = "";
public zona: string ="";
public pais : string="";

    constructor(
      public navCtrl: NavController, 
      public NavParams: NavParams, 
      public afd: AngularFireDatabase, 
      public afAuth: AngularFireAuth, 
      public alertCtrl: AlertController,
      public modalCtrl: ModalController ) {
        try{
            this.payments = [
                {id: 'EFECTIVO', name: 'EFECTIVO', icons:'assets/img/payment/cash.png'},
                {id: 'POS VISA', name: 'POS VISA', icons:'assets/img/payment/visa.png'},
                {id: 'POS MASTERCARD', name: 'POS MASTERCARD', icons:'assets/img/payment/mastercard.png'},
                {id: 'POS DINNERS', name: 'POS DINNERS', icons:'assets/img/payment/dinners.png'},
                {id: 'POS AMERICAN EXPRESS', name: 'POS AMERICAN EXPRESS', icons:'assets/img/payment/amex.png'}
              ];

              this.regalocompra = [
                {id: 'CIGARRO', name: 'CIGARRO'},
                {id: 'HIELO', name: 'HIELO'},
                {id: 'GASEOSA', name: 'REGALO 3'}            
              ];

            this.afAuth.authState.subscribe(auth => {      
            this.direcciones = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/xaddress/'); 
            this.direcciones.subscribe(lista =>{
                  
            });                    
          })
          this.direccion = NavParams.get("direccion");
          [this.direc,this.zona,this.pais] = this.direccion.split(',');

          this.orders = this.afd.list('/orders/'+firebase.auth().currentUser.uid);
          this.orders.subscribe(total =>{
            this.cantidad=total.length;

          }) 
          this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
          this.carts.subscribe(nuevo =>{
                   
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

    guardarOrder(payment, address, efec, regalo,observacion){
        if(address==null || payment==null){
            this.presentAlert();                        
          }
          else {
            let regalouno="";
            if (regalo == undefined){
              regalouno="";              
            }
            else{
              regalouno=regalo;
            }

            let valor=0
            if (efec>0){
              valor=efec              
            }
            else{
              valor=0
            }
            this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
            this.carts.subscribe(nuevo =>{
              let total = 0;
              
              for (var z = 0; z < nuevo.length; z++) {                 
                total=total+nuevo[z].item_price;
              }
              this.afd.database.ref('/orders').child(firebase.auth().currentUser.uid).child(this.cantidad+1).set({
                Fecha: new Date().toLocaleString(), //new Date().toLocaleDateString() +' '+ new Date().toLocaleTimeString() ,
                Estado: "Solicitado",
                Direccion:this.direccion,
                total: total,
                PagaEfectivo:valor,
                Regaloprimeracompra:regalouno,
                observaciones: observacion,
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
                this.openModalOrdersPage(this.cantidad+1,address,payment,observacion);
            });
          }

    }

    AlertNewOrder(qty) {
      const alert = this.alertCtrl.create({
        title: 'Pedido Exitoso' ,
        message: 'Se generó el N° de Pedido '+ qty,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              //this.gotoHome();
              //this.openModalOrdersPage();
            }
          }
        ]
      });
      alert.present();
      
    }

    gotoHome(){
        this.navCtrl.setRoot(HomePage,{direccion:this.direccion});
        location.reload();               
      }; 

      openModalOrdersPage(qtity,dire,formapago,observa): void {
        const OrdersModal = this.modalCtrl.create(OrderResumenPage,{idOrder: qtity,textdire:dire,metodo:formapago,observ:observa});
        OrdersModal.present();
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