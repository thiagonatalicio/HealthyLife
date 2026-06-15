import { Injectable } from '@angular/core';
import { ref, set, get, child } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  public usuarioId: string = '';
  public usuarioNome: string = '';
  public nomeSubject = new BehaviorSubject<string>('Visitante');
  public precisaCompletarPerfil: boolean = false;


  public dadosCarregados: boolean = false;


  
  public dadosPerfil = { idade: 0, peso: 0, altura: 0, genero: 'M', nivelAtividade: 'sedentario', objetivo: 'perder', tmb: 0 };
  public metas = { caloriasAlvo: 2000, aguaAlvo: '2L', passosAlvo: '0', carbs: 0, proteinas: 0, gorduras: 0 };
  public aguaConsumida: number = 0;
  public refeicoesDoDia: any = { cafe: [], almoco: [], jantar: [], lanches: [], avulso: [] };



  constructor() { 
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.usuarioId = user.uid;
        await this.carregarDadosDoUsuario();
      } else {
        this.limparDadosDaSessao();
      }
    });
  }

  public limparDadosDaSessao() {
    this.usuarioId = '';
    this.usuarioNome = '';
    this.dadosCarregados = false;
    this.nomeSubject.next('Visitante');
    this.dadosPerfil = { idade: 0, peso: 0, altura: 0, genero: 'M', nivelAtividade: 'sedentario', objetivo: 'perder', tmb: 0 };
    this.metas = { caloriasAlvo: 2000, aguaAlvo: '2L', passosAlvo: '0', carbs: 0, proteinas: 0, gorduras: 0 };
    this.aguaConsumida = 0;
    this.refeicoesDoDia = { cafe: [], almoco: [], jantar: [], lanches: [], avulso: [] };
  }

  async logout() {
    try { 
      await signOut(auth); 
      this.limparDadosDaSessao(); 
    } catch (error) { 
      console.error("Erro ao realizar logout:", error); 
    }
  }

  async carregarDadosDoUsuario(): Promise<void> {
    if (!this.usuarioId) return;
    try {
      const snapshot = await get(child(ref(db), 'users/' + this.usuarioId));
      if (snapshot.exists()) {
        const d = snapshot.val();
        this.usuarioNome = d.nome || '';
        this.dadosPerfil = d.dadosPerfil || this.dadosPerfil;
        this.metas = d.metas || this.metas;
        this.aguaConsumida = d.agua_consumida || 0;
        this.refeicoesDoDia = d.refeicoes_consumidas || this.refeicoesDoDia;

        this.nomeSubject.next(this.usuarioNome );
        this.dadosCarregados = true;
      } else {

        this.dadosCarregados = true;
        this.nomeSubject.next(this.usuarioNome);
      }
      
      this.dadosCarregados = true; 
    } catch (e) { 
      console.error("Erro ao carregar dados:", e); 
      this.dadosCarregados = true; 
    }
  }

  async salvarDadosNoFirebase() {

    if (!this.usuarioId || !this.dadosCarregados) {
      console.warn("Salvamento bloqueado: dados ainda não carregados.");
      return;
    }

    this.nomeSubject.next(this.usuarioNome);

    await set(ref(db, 'users/' + this.usuarioId), {
      nome: this.usuarioNome,
      dadosPerfil: this.dadosPerfil,
      metas: this.metas,
      refeicoes_consumidas: this.refeicoesDoDia,
      agua_consumida: this.aguaConsumida
    });
    if (!this.usuarioId) return;
    
    try {
      await set(ref(db, 'users/' + this.usuarioId), {
        nome: this.usuarioNome,
        dadosPerfil: this.dadosPerfil,
        metas: this.metas,
        refeicoes_consumidas: this.refeicoesDoDia,
        agua_consumida: this.aguaConsumida
      });
    } catch (e) {
      console.error("Erro ao salvar dados:", e);
    }
  }

  async salvarRefeicoesDoDia(refeicoes: any) {
    this.refeicoesDoDia = refeicoes;
    await this.salvarDadosNoFirebase();
  }

  async salvarAguaDoDia(aguaMl: number) {
    this.aguaConsumida = aguaMl;
    await this.salvarDadosNoFirebase();
  }

 
  async obterRefeicoesProntas() { 
    try { 
      const snapshot = await get(child(ref(db), 'refeicoes_prontas')); 
      return snapshot.exists() 
        ? Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] })) 
        : []; 
    } catch (e) { 
      return []; 
    } 
  }
}