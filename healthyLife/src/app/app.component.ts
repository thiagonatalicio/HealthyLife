import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {
  nomeExibido!: string;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public dataService: DataService
  ) {

    this.dataService.nomeSubject.subscribe(nome => {
      this.nomeExibido = nome;
    });
  }

  editarCadastro(){ this.menuCtrl.close(); this.navCtrl.navigateRoot('/perfil/editar'); }
  voltarParaCadastro() { this.menuCtrl.close(); this.navCtrl.navigateRoot('/perfil'); }
  async sair() { await this.dataService.logout(); await this.menuCtrl.close(); this.navCtrl.navigateRoot('/login'); }
}