import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../data.service';

@Component({
  selector: 'app-plano',
  templateUrl: './plano.page.html',
  styleUrls: ['./plano.page.scss'],
  standalone: false
})
export class PlanoPage implements OnInit {

  tmb: number = 0;
  metaCalorias: number = 0;
  metaAgua: string = '0L';
  metaPassos: string = '0'; 
  
  gastoTotalDiario: number = 0;

  porcentagemCarbs: number = 0;
  porcentagemProteinas: number = 0;
  porcentagemGorduras: number = 0;
  graficoDonutEstilo: string = ''; 

  constructor(private navCtrl: NavController, private dataService: DataService) { }

  ngOnInit() {
    if (!this.dataService.dadosPerfil || !this.dataService.dadosPerfil.peso) {
      this.navCtrl.navigateRoot('/perfil');
      return;
    }
    
    this.tmb = this.dataService.dadosPerfil.tmb || 0;
    this.gerarPlano();
  }

  gerarPlano() {
    const perfil = this.dataService.dadosPerfil;
    
    if (!perfil) return;

    switch (perfil.nivelAtividade) {
      case 'sedentario': 
        this.gastoTotalDiario = this.tmb * 1.2; 
        this.metaPassos = '5.000';
        break;
      case 'leve':       
        this.gastoTotalDiario = this.tmb * 1.375; 
        this.metaPassos = '7.500';
        break;
      case 'moderado':   
        this.gastoTotalDiario = this.tmb * 1.55; 
        this.metaPassos = '10.000';
        break;
      case 'ativo':      
        this.gastoTotalDiario = this.tmb * 1.725; 
        this.metaPassos = '12.000+';
        break;
    }

    switch (perfil.objetivo) {
      case 'perder': 
        this.metaCalorias = this.gastoTotalDiario - 500; 
        this.porcentagemCarbs = 40;
        this.porcentagemProteinas = 40; 
        this.porcentagemGorduras = 20;
        break;
      case 'manter': 
        this.metaCalorias = this.gastoTotalDiario; 
        this.porcentagemCarbs = 45;
        this.porcentagemProteinas = 30;
        this.porcentagemGorduras = 25;
        break;
      case 'ganhar': 
        this.metaCalorias = this.gastoTotalDiario + 500; 
        this.porcentagemCarbs = 50; 
        this.porcentagemProteinas = 25;
        this.porcentagemGorduras = 25;
        break;
    }
    
    this.metaCalorias = Math.round(this.metaCalorias);

    const aguaMl = (perfil.peso || 0) * 35;
    const divisor = 1000;
    const litrosAgua = aguaMl / divisor;
    this.metaAgua = litrosAgua.toFixed(1) + 'L'; 

    const p1 = this.porcentagemCarbs;
    const p2 = p1 + this.porcentagemProteinas;
    this.graficoDonutEstilo = `conic-gradient(#0084ff 0% ${p1}%, #2ecc71 ${p1}% ${p2}%, #f39c12 ${p2}% 100%)`;

    this.dataService.metas.caloriasAlvo = this.metaCalorias;
    this.dataService.metas.aguaAlvo = this.metaAgua;
    this.dataService.metas.passosAlvo = this.metaPassos;
    this.dataService.metas.carbs = this.porcentagemCarbs;
    this.dataService.metas.proteinas = this.porcentagemProteinas;
    this.dataService.metas.gorduras = this.porcentagemGorduras;

    this.dataService.salvarDadosNoFirebase();
  }

  comecarDia() {
    this.navCtrl.navigateRoot('/tabs');
  }

  recalcular() {
    this.navCtrl.navigateBack('/perfil');
  }
}