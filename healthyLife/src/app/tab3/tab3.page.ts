import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { MenuController } from '@ionic/angular'; // 1. Importe o MenuController

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {

  // 2. Injete no construtor
  constructor(
    private dataService: DataService,
    private menuCtrl: MenuController
  ) {}

  // 3. Força o bloqueio do arraste ao entrar nesta aba
  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(false);
  }

  get perfil() {
    return this.dataService.dadosPerfil;
  }

  get metas() {
    return this.dataService.metas;
  }
}