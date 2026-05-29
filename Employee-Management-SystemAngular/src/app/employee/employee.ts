import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule,CommonModule],
  providers: [EmployeeService],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit{

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null; 

    const nameRegex = /^[A-Z][a-zA-Z]*$/;
    
    if (!nameRegex.test(value)) {
      return { 'invalidNameFormat': true };
    }
    return null;
  }

  empForm:FormGroup = new FormGroup({
    firstName:new FormControl('',[Validators.required,Validators.minLength(3),this.nameValidator]),
    lastName:new FormControl('',[Validators.required,Validators.minLength(5),this.nameValidator]),
    contact:new FormControl('',[Validators.required,Validators.pattern('^[6-9][0-9]{9}$')]),
    email:new FormControl('',[Validators.required,Validators.email]),
    dob:new FormControl('',[Validators.required]),
    address:new FormControl('',[Validators.required,this.nameValidator])
  })

  emp : any[] = [];
  editId: number | null = null;

  currentPage:number=0;
  totalItems:number=0;
  pageSize:number=5;
  totalPages:number=0;

  isTableVisible:boolean=false;

  constructor(private empService:EmployeeService) {};

  ngOnInit():void{
    this.loadEmployees();
  }
  
  loadEmployees(){
    this.empService.getAllEmployee(this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.emp=data.employees;
        this.totalItems=data.totalItems;
        this.totalPages=data.totalPages;
      },
      error:(err)=>console.error("error loading paginated data",err)
    });
  }

  onPageChange(pageNumber:number){
    if(pageNumber >= 0 && pageNumber < this.totalPages){
      this.currentPage=pageNumber;
      this.loadEmployees();
    }
  }
  onSubmit(){
    if(this.empForm.invalid) return;
    console.log(this.empForm.value);

    const rowData=this.empForm.value;

    if(this.editId !== null){
      this.empService.updateEmployee(this.editId,rowData).subscribe(()=>{
        this.isTableVisible=true;
        this.loadEmployees();
        this.editId=null;
        this.empForm.reset();
      });
    } else {
      this.empService.createEmployee(rowData).subscribe(()=>{
          this.currentPage=0;
          this.isTableVisible=true;
          this.loadEmployees();
          this.empForm.reset();
      });
    }

  }

  onEdit(employeeItem: any) {
    this.editId = employeeItem.id;
    this.empForm.patchValue(employeeItem);
  }

  onDelete(id:number){
    if(!confirm("Do you want to delete Employee?")) return;

    this.empService.deleteEmployee(id).subscribe(()=>{
      if(this.emp.length === 1 && this.currentPage > 0){
        this.currentPage--;
      }
      this.loadEmployees();
    });
  
  }
}

