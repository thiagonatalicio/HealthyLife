import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { MenuController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {
 
  constructor(
    public dataService: DataService,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(false);
    
    const intervalo = parseInt(this.dataService.metas.intervaloAgua || '0');
    if (intervalo > 0) {
      this.dataService.configurarLembreteAgua(intervalo);
    }
  }

  async salvarEAgendar() {
  
    await this.dataService.salvarDadosNoFirebase();

    const intervalo = parseInt(this.dataService.metas.intervaloAgua || '0');

    await this.dataService.configurarLembreteAgua(intervalo);
    
    const mensagem = intervalo > 0 
      ? `Lembrete agendado a cada ${intervalo} minutos.` 
      : 'Lembretes desativados.';
      
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }

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
    await this.dataService.configurarLembreteAgua(0);
    
    const toast = await this.toastCtrl.create({
      message: 'Contador zerado.',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }
}