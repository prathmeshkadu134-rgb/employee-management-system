import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../employee/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  providers: [EmployeeService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm=new FormGroup({
    firstName:new FormControl('',[Validators.required]),
    dob:new FormControl('',[Validators.required])
  });

  errorMessage:String='';

  constructor(private empService:EmployeeService,private router:Router){}

  onLogin(){
    if(this.loginForm.invalid) return;

    const payload={
      firstName:this.loginForm.value.firstName!,
      dob:this.loginForm.value.dob!
    };

    this.empService.login(payload).subscribe({
      next:(res)=>{
        localStorage.setItem('token',res.token);
        localStorage.setItem('user',JSON.stringify(res.user));
        this.errorMessage='';
        this.router.navigate(['/welcome']);
      },
      error:(err)=>{
        this.errorMessage='Invalid Login Credential';
      }
    });
  }
}
