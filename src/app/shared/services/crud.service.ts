import { Observable } from "rxjs";
import { HttpService } from "./http.service";
import { MediaType } from "../media-type";
import {Account} from "../entity/account";

export abstract class CrudService<T> {

  constructor(protected httpService: HttpService,private proto?:any) {}

  protected abstract getUrl(): string;

  public genericFindAll<T>(): Observable<T[]> {
    return this.httpService.get(this.getUrl())
      .map(response =>{
        let json:T[]=response.json()
        let temp:T;
        json.map(obj=>{temp=obj;return temp;});
        return json;
      });
  }
  public findAll(): Observable<T[]> {
    if(this.proto){
      return this.httpService.get(this.getUrl())
        .map(response => response.json()
          .map(obj=>{obj.__proto__=this.proto;return obj;}));
    }else {
      return this.httpService.get(this.getUrl()).map(response => response.json());
    }
  }

  public findOne(id: number | string): Observable<T> {
    let url = `${this.getUrl()}/${id}`;

    return this.httpService.get(url)
      .map(response => response.json())
  }

  public save(entity: T): Observable<T> {
    return this.httpService.post(this.getUrl(), entity, MediaType.APPLICATION_JSON)
      .map(response => response.json());
  }

  public delete(id: number | string): Observable<void> {
    let url = `${this.getUrl()}/${id}`;

    return this.httpService.delete(url)
      .flatMap(response => Observable.empty())
  }
  public update(id: number | string, entity: T): Observable<T> {
    let url = `${this.getUrl()}/${id}`;
    return this.httpService.post(url, entity, MediaType.APPLICATION_JSON)
        .map(response => response.json());
  }
}
