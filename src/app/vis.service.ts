import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from "./model/project";

@Injectable({
  providedIn: 'root'
})
export class VisService {

  constructor(private http: HttpClient) {
  }

  getProjects() {
    return this.http.get<Project[]>(environment.apiUrl + '/api/projects');
  }

}
