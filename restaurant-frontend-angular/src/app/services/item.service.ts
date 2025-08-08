import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url = environment.apiUrl;
  private httpClient: HttpClient;
  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.httpClient = this.http;
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  getAllItems(): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/items/all", this.httpOptions);
  }

  addItem(data: any): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.post(this.url + "/items/add", data, this.httpOptions);
  }

  addImageToItem(id: number, image: File): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + AuthService.retrieveToken(),
      'Content-Type': image.type
    });

    return this.httpClient.post(this.url + "/items/addImage/"+id, image, { headers });
  }

  deleteItem(id: number): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/items/delete/" + id, this.httpOptions);
  }

  updateItem(data: any): Observable<any> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.post(this.url + "/items/update", data, this.httpOptions);
  }

  getItemsByCategory(categoryId: number) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/items/category/" + categoryId, this.httpOptions);
  }

  getItemsGroupedByCategory(categoryIds: number[]) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
      return this.httpClient.post(this.url + "/items/groupedBy", categoryIds, this.httpOptions);
  }

  getItemById(id: number) {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + AuthService.retrieveToken());
    return this.httpClient.get(this.url + "/items/" + id, this.httpOptions);
  }

}
