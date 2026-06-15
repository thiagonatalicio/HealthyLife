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

    this.menuCtrl.swipeGesture(false);

    
    onAuthStateChanged(auth, (user) => {
      this.estaLogado = !!user;
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
      
      await this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  }
}