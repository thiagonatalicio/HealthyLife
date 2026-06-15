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
    // 1. Bloqueio definitivo do gesto de arraste (swipe) globalmente
    this.menuCtrl.swipeGesture(false);

    // 2. Monitoramento de estado para exibir/esconder o menu
    onAuthStateChanged(auth, (user) => {
      this.estaLogado = !!user;
    });

    this.dataService.nomeSubject.subscribe(nome => {
      this.nomeExibido = nome || 'Visitante';
    });
  }

  // Navega para o perfil e fecha o menu
  voltarParaCadastro() { 
    this.menuCtrl.close(); 
    this.navCtrl.navigateRoot('/perfil'); 
  }

  // Método de saída corrigido: espera fechar o menu antes de navegar
 async sair() { 
    try {
      // 1. Fecha o menu
      await this.menuCtrl.close();
      
      // 2. Chama o método de limpeza do serviço (ele já faz o signOut e o reset)
      await this.dataService.logout(); 
      
      // 3. Redireciona
      await this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  }
}