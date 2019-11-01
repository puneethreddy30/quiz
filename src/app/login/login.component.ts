import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './service/auth.service';

declare var require: any; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  name : string;
  passward : string;
  error:string;
  login:any;
  form;
  constructor(private fb: FormBuilder,
    private auth: AuthService,private router?: Router) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    }
    
  sendToken(token: string) {
    localStorage.setItem("LoggedInUser", token)
  }
  getToken() {
    return localStorage.getItem("LoggedInUser")
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("LoggedInUser");
    this.router.navigate(["login"]);
  }
  ngOnInit() {
    
this.login = require('../../data/user.json');
console.log("login", this.login);
  }

  welcomeMe(uname:string,pwd:string){

    this.name = uname;
    this.passward = pwd;
    if (this.form.valid) {
      this.auth.sendToken(this.form.value.email)
      this.router.navigate(["home"]);
    }
    for(let data in this.login) {
      console.log(this.name);
      console.log("login ", this.login[data].name);
      if(this.name==(this.login[data].name) && this.passward === this.login[data].passward) {
      this.router.navigate(['/home']);
      break;
      }
    }
    
    this.error = "Check the credentials";
    
  }
}