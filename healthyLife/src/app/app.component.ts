import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { DataService } from './data.service';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {
  nomeExibido: string = 'Visitante';
  estaLogado: boolean = false;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public dataService: DataService
  ) {
    this.menuCtrl.swipeGesture(false);

    onAuthStateChanged(auth, (user) => {
      // 1. ATUALIZA O MENU PRIMEIRO (Isso traz seu menu de volta!)
      this.estaLogado = !!user;

      // 2. DEPOIS VERIFICA A TRAVA DE NAVEGAÇÃO
      if (this.dataService.bloqueioRedirecionamento) {
        return; 
      }

      // 3. FAZ O REDIRECIONAMENTO
      if (user) {
        this.navCtrl.navigateRoot('/tabs/tab1');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });

    this.dataService.nomeSubject.subscribe(nome => {
      this.nomeExibido = nome || 'Visitante';
    });
  }

  voltarParaCadastro() { 
    this.menuCtrl.close(); 
    this.navCtrl.navigateRoot('/perfil'); 
  }

  async sair() { 
    try {
      await this.menuCtrl.close();
      await this.dataService.logout(); 
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  }
}