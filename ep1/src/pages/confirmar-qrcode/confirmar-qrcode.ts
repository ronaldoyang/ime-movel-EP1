import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PresencaService } from '../../services/presenca.service';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the ConfirmarQrcode page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-confirmar-qrcode',
  templateUrl: 'confirmar-qrcode.html',
})
export class ConfirmarQrcode {
  isReading:boolean;
  isCancelled:boolean;
  seminarioId:string;
  isOkSeminario:boolean;
  isOkQRCode:boolean;
  nusp:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner:BarcodeScanner, 
    private presencaService: PresencaService, private menu: MenuController,
    private storage: Storage ) {
    this.iniciaAposLerNumUSP();
  }

  readQRCode() {
    // console.log( "Passou aqui" );
    this.barcodeScanner.scan().then((barcodeData) => {
        // console.log( JSON.stringify( barcodeData ) );
        // console.log( "Seminario: " + barcodeData["text"] );
        if ( barcodeData["cancelled"] ) {
          // console.log( "Cancelado." );
          this.navCtrl.pop();
        } else {
          // console.log( "Lido." );
          this.seminarioId = barcodeData["text"];
          this.presencaService
              .submitPresenca(this.nusp, this.seminarioId )
              .then(dataSent => {
                    if ( dataSent.success ) {
                          this.showScreenMessage(  "Sucesso! Você acabou de confirmar a sua presença! ( Id do seminário: "+this.seminarioId+")" );
                    } else {
                          this.showScreenMessage( "Falha ao confirmar a presença! ( Id do seminário: "+this.seminarioId+")" );
                    }
                },
                error => {
                    this.showScreenMessage( "Falha ao confirmar a presença! ("+this.seminarioId+")" );

                });
          
        }
    }, (err) => {
        this.showScreenMessage( "Falha ao confirmar a presença!");
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ConfirmarQrcode');

  }

  iniciaAposLerNumUSP() {
    this.storage.ready().then(() => {
        this.storage.get('nusp').then((val) => {
          this.nusp = val;
          this.readQRCode();
        });
      },
      error=>{
        this.showScreenMessage( "Falha ao obter usuário logado");
      });
  }


  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }

  showScreenMessage( msg ) {
         this.navCtrl.setRoot( "MessagePage", { msg:msg, title:"Confirmar QRCode" } );
  }
}
