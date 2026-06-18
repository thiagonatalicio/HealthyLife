import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { auth } from '../../firebaseConfig'; // Ajuste o caminho

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      // O onAuthStateChanged não retorna booleano direto, precisamos de uma promessa
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Para de ouvir para não ficar executando várias vezes
        if (user) {
          resolve(true); // Está logado, pode entrar
        } else {
          this.router.navigate(['/login']); // Não está logado, vai pro login
          resolve(false); // Bloqueia a entrada
        }
      });
    });
  }
}