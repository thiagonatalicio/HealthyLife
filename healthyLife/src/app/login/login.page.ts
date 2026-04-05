import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonButton, } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonButton, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) {}
  
  teste() {
  console.log("clicou");
  this.router.navigateByUrl('/tabs/tab1');
}
  ngOnInit() {
  }
  
}
