import { Component } from '@angular/core';
import { NavController, ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';

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
    private platform: Platform,
    public alertCtrl: AlertController,
    public loadingCtrl : LoadingController
  ) { }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
        // Do custom things with auth
      })
      .catch(err => {
        // Handle error
        let toast = this.toastCtrl.create({
          message: err.message,
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
        return firebase.auth().signInWithCredential(facebookCredential);        
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }



  facebookLogin(): void {
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
        })
        .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
      });

    }).catch((error) => { console.log(error) });
  }

  logout(){
    return firebase.auth().signOut();    
  }

  resetpass(){
    let promp = this.alertCtrl.create({
      title : 'Enter Your E-mail',
      message : 'A new password will be sent to your email',
      inputs : [{
        name: 'recoveremail',
        placeholder:'you@example.com',
      },],
      buttons: [{
        text : 'Cancel',
        handler: data => {
          console.log('cancel click');
        }
      },
    {
      text : 'Submit',
      handler: data =>{

        let loading =  this.loadingCtrl.create({
          dismissOnPageChange : true,
          content : 'reseting your password'
        });
        loading.present();
        
        firebase.auth().sendPasswordResetEmail(data.recoveremail).then(()=>{
          loading.dismiss().then(()=>{
            let alert = this.alertCtrl.create({
              title:'check your email',
              subTitle : 'Password reset succesfull',
              buttons: ['OK']
            });
            alert.present();
          })
        },Error=>{
          let alert1 = this.alertCtrl.create({
            title:'Error reseting password',
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