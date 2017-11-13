import { Component } from '@angular/core';
import { NavController, ToastController, Platform,AlertController, MenuController,LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
//import { TwitterConnect } from '@ionic-native/twitter-connect';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
    
  }
  userProfile: any = null;
  
  constructor (
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private facebook: Facebook,
    //private twiter: TwitterConnect,
    private platform: Platform,
    private callNumber: CallNumber,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    public loadingCtrl : LoadingController
  ) { 
    this.menuCtrl.enable(false);
  }

 

  CallNumero(number){
    this.callNumber.callNumber(number, true)
   // .then(() => console.log('Launched dialer!'))
   // .catch(() => console.log('Error launching dialer'));
  }
    
  

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
        this.menuCtrl.enable(true);
        const Credentialmail = firebase.auth.EmailAuthProvider.credential(this.loginData.email,this.loginData.password) ;// .FacebookAuthProvider.credential(res.authResponse.accessToken); 

      
        return firebase.auth().signInWithCredential(Credentialmail); 
        // Do custom things with auth
      })
      .catch(err => {
        // Handle error
        let toast = this.toastCtrl.create({
          message: "Usuario y/o contraseña incorrecta", //err.message,
          duration: 1000
        });
        toast.present();
      });
  }

  signup() {
    this.navCtrl.push(SignupPage, { email: this.loginData.email });
  }

  loginFacebook() {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);        
        this.menuCtrl.enable(true);   
        return firebase.auth().signInWithCredential(facebookCredential); 
        
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }


/*  logintwiter() {
    if(this.platform.is('cordova')){
        const twiterCredential = firebase.auth.TwitterAuthProvider.credential(this.onSuccess, this.onError);
        this.menuCtrl.enable(true);   
        return firebase.auth().signInWithCredential(twiterCredential);
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.TwitterAuthProvider())
        .then(res => console.log(res));
    }
  } */
  
  onSuccess(response) {
    console.log('response', response);
    console.log(response.userName);
    console.log(response.userId);
    console.log(response.secret);
    console.log(response.token);
  }
  
  onError(error) {
    console.log('error', error);
  }

  facebookLogin(): void {
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          //console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
        })
        .catch((error) => {
          //console.log("Firebase failure: " + JSON.stringify(error));
      });

    }).catch((error) => { console.log(error) });
  }

  logout(){

    return firebase.auth().signOut();    
  
  }

  resetpass(){
    let promp = this.alertCtrl.create({
      title : 'Ingresa tu E-mail',
      message : 'Un nuevo password se enviará a tu correo',
      inputs : [{
        name: 'recoveremail',
        placeholder:'tu-correo@dominio.com',
      },],
      buttons: [{
        text : 'Cancelar',
        handler: data => {
          //console.log('cancel click');
        }
      },
    {
      text : 'Aceptar',
      handler: data =>{

        let loading =  this.loadingCtrl.create({
          dismissOnPageChange : true,
          content : 'Reseteando su contraseña'
        });
        loading.present();
        
        firebase.auth().sendPasswordResetEmail(data.recoveremail).then(()=>{
          loading.dismiss().then(()=>{
            let alert = this.alertCtrl.create({
              title:'Revisa tu correo',
              subTitle : 'Contraseña restaurada correctamente',
              buttons: ['OK']
            });
            alert.present();
          })
        },Error=>{
          let alert1 = this.alertCtrl.create({
            title:'Error al intentar restaurar tu contraseña',
            subTitle : Error.message,
            buttons: ['OK']
          });
          alert1.present();
        });
      }
    }]
    })
    promp.present();
    
  }

 



}