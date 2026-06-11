import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private navCtrl: NavController, 
    private toastCtrl: ToastController,
    private dataService: DataService,
    private alertCtrl: AlertController 
  ) { }

  async abrirAlertaRecuperacao() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Senha',
      message: 'Digite seu e-mail para receber o link de redefinição:',
      inputs: [
        {
          name: 'emailRecuperacao',
          type: 'email',
          placeholder: 'seu@email.com',
          value: this.email 
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: (data) => {
            if (data.emailRecuperacao) {
              this.recuperarSenha(data.emailRecuperacao);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async recuperarSenha(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      this.mostrarToast('E-mail enviado! Verifique sua caixa de entrada.', 'success');
    } catch (erro) {
      console.log(erro);
      this.mostrarToast('Erro ao enviar e-mail. Verifique o endereço.', 'danger');
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.mostrarToast('Preencha e-mail e senha.', 'warning');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, this.email, this.password);
      await this.dataService.carregarDadosDoUsuario();
      this.navCtrl.navigateRoot('/tabs/tab1');
    } catch (error) {
      this.mostrarToast('Erro: Verifique os dados.', 'danger');
    }
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    await toast.present();
  }

  irParaCadastro() { this.navCtrl.navigateForward('/auth'); }
}