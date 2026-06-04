import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page {

  constructor(private dataService: DataService) {}

  get perfil() {
    return this.dataService.dadosPerfil;
  }

  get metas() {
    return this.dataService.metas;
  }
}