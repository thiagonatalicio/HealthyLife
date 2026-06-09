import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { DataService } from '../data.service';
import { sendPasswordResetEmail } from 'firebase/auth';


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
    private dataService: DataService 
  ) { }

  async recuperarSenha(email: string) {
    console.log(this.email);
  try {
    await sendPasswordResetEmail(auth, email);

    alert('E-mail de recuperação enviado!');
  } catch (erro) {
    console.log(erro);
    alert('Erro ao enviar e-mail de recuperação.');
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