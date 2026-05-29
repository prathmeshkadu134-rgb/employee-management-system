import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome implements OnInit{
  user:any;
  
  constructor(private router:Router){}

  ngOnInit(): void {
    const data=localStorage.getItem('user');
    if(data){
      this.user=JSON.parse(data);
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
