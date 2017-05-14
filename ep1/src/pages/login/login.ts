import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';
import { CadastroPage } from '../cadastro/cadastro';
import { SeminarioPage } from '../seminario/seminario';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  private loginGroup: FormGroup;
  cadastroPage: any;
  seminarioPage: any;
  
  constructor(private storage: Storage, private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService, public navCtrl: NavController, public navParams: NavParams) {
    this.cadastroPage = CadastroPage;
    this.seminarioPage = SeminarioPage;
    this.loginGroup = this.formBuilder.group({
      type: ['aluno', Validators.required],
      nusp: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      auto:[false]
    });
  };

  ionViewWillEnter() {
    this.storage.ready().then(() => {
      this.storage.get('auto').then((val) => {
        this.loginGroup.value.auto = (val !== null) ? val : false;
        if (this.loginGroup.value.auto) {
          Promise.all([
            this.storage.get('nusp').then((val) => {
              this.loginGroup.value.nusp = (val !== null) ? val : '';
            }),
            this.storage.get('password').then((val) => {
              this.loginGroup.value.password = (val !== null) ? val : '';
            }),
            this.storage.get('type').then((val) => {
              this.loginGroup.value.type = (val !== null) ? val : 'aluno';
            })
          ]).then(value =>  { this.login() });
        }
      })
    });
  }

  login() {
    switch(this.loginGroup.value.type) {
      case 'aluno':
        this.alunoService
          .loginAluno(this.loginGroup.value.nusp, this.loginGroup.value.password)
          .then(aluno =>  {
                            if (aluno.success) {
                              this.loadSeminarioPage();
                            }
                            else alert("Falha Login");
                          } ,
                error => alert(error));
        break;
      case 'professor':
        this.professorService
          .loginProfessor(this.loginGroup.value.nusp, this.loginGroup.value.password)
          .then(professor => {
                              if (professor.success) {
                                this.loadSeminarioPage();
                              }
                              else alert("Falha Login");
                            } ,
                error => alert(error));
        break;
      default:
        alert('Escolha entre aluno e professor');
    }
  }

  private loadSeminarioPage () {
    this.storage.ready().then(() => {
      Promise.all([
        this.storage.set('nusp', this.loginGroup.value.nusp),
        this.storage.set('type', this.loginGroup.value.type),
        this.storage.set('password', this.loginGroup.value.password),
        this.storage.set('auto', this.loginGroup.value.auto)
      ]).then(() => {
        this.navCtrl.setRoot(this.seminarioPage, { nusp: this.loginGroup.value.nusp, type: this.loginGroup.value.type });
      })
    });
  }
}
