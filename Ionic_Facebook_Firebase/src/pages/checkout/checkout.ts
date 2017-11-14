import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController,LoadingController,ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';
import { GooglemapPage } from '../Googlemap/Googlemap';
import { MapComponent } from '../../components/map/map';
import { OrderResumenPage } from '../order-resumen/order-resumen';
import { SettingsPage } from '../settings/settings';

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
public users: FirebaseListObservable<any>;
public usuarionuevo: any;
public telefono: any;
public llave : any;
public direccion : string = "";
public hlatitud:string ="";
public hLongitud:string="";
public direc: string = "";
public zona: string ="";
public pais : string="";
public totalpago:string ="";

    constructor(
      public navCtrl: NavController, 
      public NavParams: NavParams, 
      public afd: AngularFireDatabase, 
      public afAuth: AngularFireAuth, 
      public alertCtrl: AlertController,
      public loadingCtrl:LoadingController,
      public modalCtrl: ModalController,
      public toastCtrl: ToastController ) {
        try{
            this.payments = [
                {id: 'EFECTIVO', name: 'EFECTIVO', icons:'assets/img/payment/cash.png'},
                {id: 'POS VISA', name: 'POS VISA', icons:'assets/img/payment/visa.png'},
                {id: 'POS MASTERCARD', name: 'POS MASTERCARD', icons:'assets/img/payment/mastercard.png'},
                {id: 'POS DINNERS', name: 'POS DINNERS', icons:'assets/img/payment/dinners.png'},
                {id: 'POS AMERICAN EXPRESS', name: 'POS AMERICAN EXPRESS', icons:'assets/img/payment/amex.png'}
              ];

              this.regalocompra = [
                {id: 'CIGARRO', name: 'CIGARRO',icons:'assets/img/chuperobsequio/cigarros.png'},
                {id: 'HIELO', name: 'HIELO',icons:'assets/img/chuperobsequio/hielo.png'},
                {id: 'GASEOSA', name: 'GASEOSA',icons:'assets/img/chuperobsequio/soda.png'}            
              ];

            this.afAuth.authState.subscribe(auth => {      
            this.direcciones = this.afd.list('/users/'+firebase.auth().currentUser.uid+'/xaddress/'); 
            this.direcciones.subscribe(lista =>{
                  
            });                    
          })
          this.direccion = NavParams.get("direccion");
          this.hLongitud = NavParams.get("hLongitud");
          this.hlatitud = NavParams.get("hlatitud");
          this.totalpago = NavParams.get("Total");

          console.log("Longitud :"+this.hLongitud);
          console.log("Latitud : "+this.hlatitud);
          [this.direc,this.zona,this.pais] = this.direccion.split(',');

          this.users = this.afd.list('/users/'+firebase.auth().currentUser.uid);
          this.users.subscribe(usuario =>{
            this.usuarionuevo=usuario[3].$value;
            this.telefono=usuario[5].$value;
            console.log(this.usuarionuevo);

          })
          this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
          this.carts.subscribe(nuevo =>{
                   
          });

        }catch (e){}        
    }
    presentAlert(mensaje) {
        const alert = this.alertCtrl.create({
          title: 'Aviso!',
          subTitle: mensaje,
          buttons: ['Volver']
        });
        alert.present();
      }

    guardarOrder(payment, address, efec, regalo,observacion){
     var pase="SI";
      
      
        if(payment=="EFECTIVO")
        {
          if(efec==null || efec==undefined)
          {
            this.presentAlert("Debe ingresar un monto efectivo");
            pase="NO";
            return;
            
          }
          else if(efec==0)
          {
            this.presentAlert("Debe ingresar un monto efectivo");
            pase="NO";
            return;
            
          }
          else if(efec<this.totalpago)
          {
            this.presentAlert("El monto en efectivo debe ser mayor o igual al total");
            pase="NO"; 
            return;
            
          }
          else{
            pase="SI";
          }

        }
        
        if (this.telefono==""){

          this.presentToast();
  
          let modal = this.modalCtrl.create(SettingsPage);
          modal.present();
  
          pase="NO";
        }
        else
        {
          pase="SI";
        }
        

        if(pase=="SI")
        {
          if(address==null || payment==null){
            this.presentAlert("Debe selecionar una dirección y un medio de pago");                        
          }
          else {
            const loading = this.loadingCtrl.create({
              //spinner: 'hide',
              spinner:"bubbles",
              content: 'Registrando su pedido'
            });
          
            loading.present();
          
            setTimeout(() => {

                if(observacion==null){
                    observacion="";
                }

                let regalouno="";
                if (regalo == undefined){
                  regalouno="";  
                  //this.presentAlert("Debe seleccionar un ChuperObsequio");   
                  //return; 
                  //regalo="";            
                }
                else{
                  regalouno=regalo;
                }

                /*if(regalo==null){
                  this.presentAlert("Debe seleccionar un ChuperObsequio");   
                  return; 
                }*/

                let valor=0
                if (efec>0){
                  valor=efec              
                }
                else{
                  valor=0
                }


  //              console.log(new Date().toLocaleTimeString());
                              
                this.carts = this.afd.list('/cart/'+firebase.auth().currentUser.uid+'/');
                this.carts.subscribe(nuevo =>{
                let total = 0;
                  
                  for (var z = 0; z < nuevo.length; z++) {                 
                    total=total+nuevo[z].item_price;
                  }
                  var fec = new Date();
                  var fecha = fec.getFullYear(); 
                  var day = fec.toDateString().substring(8,10);

                  //var day: string = (fec.getDate()+20).toString().trim();
                 
                  //var newday= ('0'+ day).slice(-2);

                  var hora: string = fec.toString().substring(16,24);
                  let hh,mm,ss
                  [hh,mm,ss] = hora.split(':');       
                  
                  try
                  {         
                    var uidData = firebase.auth().currentUser.displayName.substring(0,1).toUpperCase();
                  }
                  catch (e){
                    uidData= "N";
                  }

                  var today_date =fec.getDate().toString() + '/' + (fec.getMonth()+1).toString() +'/'+ fec.getFullYear().toString() + ' ' + hora;  //fec.getFullYear().toString()+'-'+(fec.getMonth()+1).toString()+'-'+fec.getDate().toString();

                  this.llave = day+hh+mm+ss+fecha+uidData;
                  //console.log(fecha);
                  //console.log(hora);
                  //console.log(uidData);
                  this.afd.database.ref('/orders').child(this.llave).set({
                    userId: firebase.auth().currentUser.uid,
                    total: total,
                    adress_id : address,
                    payment : payment,
                    cliente: firebase.auth().currentUser.displayName,
                    observaciones: observacion,
                    PagaEfectivo:valor,
                    Regaloprimeracompra:regalouno,
                    status:'SOLICITADO',
                    nrotel : this.telefono,
                    fechaPedido: today_date,
                    idpedido: this.llave
                  })

                
                  
                    for (var i = 0; i < nuevo.length; i++) {                   
                      this.afd.database.ref('/orders-details/').child(this.llave).child(i.toString()).set(
                        {                                            
                          'product': nuevo[i].item_name,
                          'produc_img' : nuevo[i].item_image,
                          'produc_des' : nuevo[i].item_description,
                          'price':nuevo[i].item_price,
                          'qty' : nuevo[i].item_qty,
                          'idpedido': this.llave                        
                      })
                        /* this.afd.database.ref('/orders/').child(firebase.auth().currentUser.uid).child(this.cantidad+1).child(i.toString()).set(
                          {                                            
                            'product': nuevo[i].item_name,
                            'produc_img' : nuevo[i].item_image,
                            'produc_des' : nuevo[i].item_description,
                            'price':nuevo[i].item_price,
                            'qty' : nuevo[i].item_qty,
                            userId: firebase.auth().currentUser.uid,
                            
                        }) */                   
                    }

                    this.afd.database.ref('/orders-details').child(this.llave).update({
                      idpedido: this.llave
                    })


                    if(this.usuarionuevo==true){
                      this.afd.list('/users/').update(firebase.auth().currentUser.uid, {nuevousuario:false});      
                    }

                    this.guardarDireccion(this.direccion,this.hlatitud,this.hLongitud);
                    this.carts.remove();
                    this.openModalOrdersPage(this.llave,address,payment,observacion);

                });
            }, 3000);

            setTimeout(() => {
              loading.dismiss();
            }, 5000);

          }
        }
        else{}

    }

    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Debe actualizar su número de telefono',
        duration: 2000,
        position: 'top'
      });
      toast.present();
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
      
      guardarDireccion(direcc, latit,longit){
        this.afd.database.ref('/direccion/'+firebase.auth().currentUser.uid).push({
          direccion: direcc,
          latitud : latit,
          longitud : longit
        })

      }
}