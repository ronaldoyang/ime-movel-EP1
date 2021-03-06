import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MyApp } from './app.component';
import { LoginPage2 } from '../pages/login/login2';
import { AlunoService } from '../services/aluno.service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage2
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage2
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlunoService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
