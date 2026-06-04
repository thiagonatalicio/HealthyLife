import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {
  
  constructor(public dataService: DataService) {}

  get aguaConsumida(): number { 
    return this.dataService.aguaConsumida; 
  }

  get metaAgua(): number {
    const alvo = this.dataService.metas.aguaAlvo || '0L';
    const litros = parseFloat(alvo);
    return litros > 0 ? litros * 1000 : 2500;
  }

  get porcentagemAgua(): number {
    const total = this.metaAgua;
    if (total === 0) return 0;
    const p = (this.aguaConsumida / total) * 100;
    return Math.min(100, p);
  }

  get faltam(): number {
    return Math.max(0, this.metaAgua - this.aguaConsumida);
  }

  async adicionarAgua(ml: number) {
    this.dataService.aguaConsumida += ml;
    await this.dataService.salvarAguaDoDia(this.dataService.aguaConsumida);
  }

  async zerarAgua() {
    this.dataService.aguaConsumida = 0;
    await this.dataService.salvarAguaDoDia(0);
  }
}