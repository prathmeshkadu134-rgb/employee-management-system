import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class EmployeeService{
 private baseUrl='http://localhost:8083/api';

 constructor(private http:HttpClient) {};

 login(payload : {firstName:String;dob:String}):Observable<any>{
    return this.http.post(`${this.baseUrl}/login`,payload)
 }

 getAllEmployee(page:number,size:number): Observable<any>{
   const params = new HttpParams()
   .set('page',page.toString())
   .set('size',size.toString());

    return this.http.get<any[]>(`${this.baseUrl}/employee`,{params})
 }

 createEmployee(employee:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/employee`,employee)
 }

 updateEmployee(id:number,employee:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/employee/${id}`,employee)
 }

 deleteEmployee(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/employee/${id}`)
 }
}