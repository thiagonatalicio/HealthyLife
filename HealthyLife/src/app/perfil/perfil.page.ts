import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular'; 
import { DataService } from '../data.service'; 

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  idade: number | null = null;
  peso: number | null = null;
  altura: number | null = null;
  
  genero: string = 'M'; 
  nivelAtividade: string = 'sedentario';
  objetivo: string = 'perder'; 

  tmb: number = 0;

  constructor(
    private navCtrl: NavController, 
    private dataService: DataService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  // Preenche os campos com os dados que já existem no DataService
  if (this.dataService.dadosCarregados) {
    this.idade = this.dataService.dadosPerfil.idade || null;
    this.peso = this.dataService.dadosPerfil.peso || null;
    this.altura = this.dataService.dadosPerfil.altura || null;
    this.genero = this.dataService.dadosPerfil.genero;
    this.nivelAtividade = this.dataService.dadosPerfil.nivelAtividade;
    this.objetivo = this.dataService.dadosPerfil.objetivo;
  }
}

  selecionarGenero(gen: string) {
    this.genero = gen;
  }

  selecionarObjetivo(obj: string) {
    this.objetivo = obj;
  }

  calcularTMB() {
    const i = this.idade || 0;
    const p = this.peso || 0;
    const a = this.altura || 0;

    switch (this.genero) {
      case 'M':
        this.tmb = 66.5 + (13.75 * p) + (5.003 * a) - (6.75 * i);
        break;
      case 'F':
        this.tmb = 655.1 + (9.563 * p) + (1.850 * a) - (4.676 * i);
        break;
      case 'O':
        const baseM = 66.5 + (13.75 * p) + (5.003 * a) - (6.75 * i);
        const baseF = 655.1 + (9.563 * p) + (1.850 * a) - (4.676 * i);
        this.tmb = (baseM + baseF) / 2;
        break;
    }
    this.tmb = Math.round(this.tmb);
  }

  
async avancar() {
  if (!this.idade || !this.peso || !this.altura || this.idade <= 0 || this.peso <= 0 || this.altura <= 0) {
    return;
  }
  
  this.calcularTMB();

  this.dataService.dadosPerfil = {
    idade: this.idade,
    peso: this.peso,
    altura: this.altura,
    genero: this.genero,
    nivelAtividade: this.nivelAtividade,
    objetivo: this.objetivo,
    tmb: this.tmb
  };

  try {
    await this.dataService.salvarDadosNoFirebase();
    this.navCtrl.navigateForward('/plano'); 
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}
}