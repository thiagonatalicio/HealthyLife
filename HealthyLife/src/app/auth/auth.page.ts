import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { DataService } from '../data.service';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 

@Component({
 selector: 'app-auth',
 templateUrl: './auth.page.html',
 styleUrls: ['./auth.page.scss'],
 standalone: false
})
export class AuthPage {
 nome: string = '';
 email: string = '';
 senha: string = '';

 constructor(
  private navCtrl: NavController, 
  private dataService: DataService,
  private toastCtrl: ToastController
 ) {}

 async irParaPerfil() {
 
  if (!this.nome.trim() || !this.email.trim() || !this.senha.trim()) {
   this.mostrarToast('Por favor, preencha todos os campos.', 'warning');
   return;
  }

  try {
   
   const credenciais = await createUserWithEmailAndPassword(auth, this.email, this.senha);
   
   this.dataService.usuarioId = credenciais.user.uid;
   this.dataService.usuarioNome = this.nome;

   await this.dataService.salvarDadosNoFirebase(); 

   this.mostrarToast('Conta criada com sucesso!', 'success');

   this.navCtrl.navigateRoot('/perfil');

  } catch (error: any) {
   this.mostrarToast('Erro ao criar conta: ' + error.message, 'danger');
  }
 }

 async mostrarToast(msg: string, color: string) {
  const toast = await this.toastCtrl.create({ 
   message: msg, 
   duration: 2000, 
   color: color 
  });
  await toast.present();
 }
}