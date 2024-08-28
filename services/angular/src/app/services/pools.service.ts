import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pool } from '../models/pool';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoolsService {
  private baseUrl = environment.expressUrl;

  constructor(private http: HttpClient) { }

  public getPools(): Observable<Pool[]> {
    return this.http.get<Pool[]>(`${this.baseUrl}/pools`);
  }

  public getPool(id: string): Observable<Pool[]> {
    return this.http.get<Pool[]>(`${this.baseUrl}/pools/${id}`);
}

  public async checkIfPoolExists(poolName: string): Promise<boolean> {
    const matchingPools = await this.getPoolByName(poolName).toPromise();
    if (matchingPools.length === 0) {
      return false;
    }
    return true;
  }

  public getPoolByName(name: string): Observable<Pool[]> {
    return this.http.get<Pool[]>(`${this.baseUrl}/pools/name/${name}`);
  }

  public addPool(poolToAdd: Pool): Promise<any> {
    return this.http.post<Pool>(`${this.baseUrl}/pools/`, poolToAdd)
      .toPromise();
  }

  public removePool(poolToRemove: Pool): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/pools/${poolToRemove.id}`);
  }
}
