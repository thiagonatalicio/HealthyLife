import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ToastController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  isModalOpen: boolean = false;
  refeicaoSelecionada: string = '';
  pratosProntos: any[] = [];

  constructor(
    public dataService: DataService, 
    private toastCtrl: ToastController,
    private menuCtrl: MenuController 
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(false);
    this.carregarRefeicoesDaNuvem();
  }
  
  get refeicoes() { return this.dataService.refeicoesDoDia; }
  get caloriasAlvo() { return this.dataService.metas.caloriasAlvo || 2000; }
  get caloriasConsumidas() { return this.total(this.refeicoes.cafe) + this.total(this.refeicoes.almoco) + this.total(this.refeicoes.jantar) + this.total(this.refeicoes.lanches) + this.total(this.refeicoes.avulso); }
  get caloriasRestantes() { return Math.max(0, this.caloriasAlvo - this.caloriasConsumidas); }
  get porcentagemConsumida() { return Math.min(100, (this.caloriasConsumidas / this.caloriasAlvo) * 100); }

  total(lista: any[]): number { return lista ? lista.reduce((acc, item) => acc + item.calorias, 0) : 0; }
  abrirModal(tipo: string) { this.refeicaoSelecionada = tipo; this.isModalOpen = true; }
  fecharModal() { this.isModalOpen = false; }

  async adicionarPrato(prato: any) {
    this.refeicoes[this.refeicaoSelecionada].push({ ...prato });
    await this.dataService.salvarRefeicoesDoDia(this.refeicoes);
    this.fecharModal();
  }

  async carregarRefeicoesDaNuvem() {
    try {
      this.pratosProntos = await this.dataService.obterRefeicoesProntas();
    } catch (erro) {
      console.error('Erro ao buscar refeições:', erro);
    }
  }

  async zerarCalorias() { 
    this.dataService.refeicoesDoDia = { cafe: [], almoco: [], jantar: [], lanches: [], avulso: [] }; 
    await this.dataService.salvarRefeicoesDoDia(this.dataService.refeicoesDoDia);
  }
}