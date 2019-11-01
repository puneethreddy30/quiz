import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare var require: any; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name : string;
  passward : string;
  error:string;
  login:any;
  constructor(private router?: Router) { }

  ngOnInit() {
    
this.login = require('../../data/user.json');
console.log("login", this.login);
  }

  welcomeMe(uname:string,pwd:string){
    this.name = uname;
    this.passward = pwd;
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