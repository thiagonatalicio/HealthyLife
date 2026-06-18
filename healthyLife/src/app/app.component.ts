import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { DataService } from './data.service';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
    // 1. Bloqueia o menu lateral por padrão
    this.menuCtrl.swipeGesture(false);

    // 2. Monitora o estado de autenticação para redirecionar corretamente
    onAuthStateChanged(auth, (user) => {
      this.estaLogado = !!user;

      if (user) {
        // Se já tem sessão, vai direto para as abas
        this.navCtrl.navigateRoot('/tabs/tab1');
      } else {
        // Se não tem, vai para o login
        this.navCtrl.navigateRoot('/login');
      }
    });

    // 3. Atualiza o nome de exibição no menu
    this.dataService.nomeSubject.subscribe(nome => {
      this.nomeExibido = nome || 'Visitante';
    });
  }

  // Ação de navegar para o perfil
  voltarParaCadastro() { 
    this.menuCtrl.close(); 
    this.navCtrl.navigateRoot('/perfil'); 
  }

  // Ação de logout seguro
  async sair() { 
    try {
      await this.menuCtrl.close();
      await this.dataService.logout(); 
      // O onAuthStateChanged será disparado pelo logout, 
      // e o redirecionamento para /login acontecerá automaticamente pelo construtor.
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  }
}