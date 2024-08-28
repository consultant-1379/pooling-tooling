import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TestEnvironment } from '../models/testEnvironment';
import { randomSleep } from '../utils/random-sleep';

@Injectable({
  providedIn: 'root'
})
export class TestEnvironmentService {
    private baseUrl = environment.expressUrl;

    constructor(private http: HttpClient) { }

    public getTestEnvironment(id: string): Observable<TestEnvironment[]> {
        return this.http.get<TestEnvironment[]>(`${this.baseUrl}/test-environments/${id}`);
    }

    public getTestEnvironments(): Observable<TestEnvironment[]> {
      randomSleep(1.5);
      return this.http.get<TestEnvironment[]>(`${this.baseUrl}/test-environments/sorted`);
    }

    public removeTestEnvironment(environmentToRemove: TestEnvironment): Observable<TestEnvironment> {
      return this.http.delete<any>(`${this.baseUrl}/test-environments/${environmentToRemove.id}`);
    }

    public getTestEnvironmentByName(name: string): Observable<TestEnvironment[]> {
      return this.http.get<TestEnvironment[]>(`${this.baseUrl}/test-environments/name/${name}`);
    }

    public addTestEnvironment(environmentToAdd: TestEnvironment): Promise<TestEnvironment> {
      return this.http.post<TestEnvironment>(`${this.baseUrl}/test-environments/`, environmentToAdd)
        .toPromise();
    }

    public patchTestEnvironment(environmentToPatch: TestEnvironment): Promise<TestEnvironment> {
      return this.http.patch<TestEnvironment>(`${this.baseUrl}/test-environments/${environmentToPatch.id}`,
        environmentToPatch).toPromise();
    }

    public async checkIfEnvironmentExists(environmentName: string): Promise<boolean> {
      const matchingTestEnvironments = await this.getTestEnvironmentByName(environmentName).toPromise();
      return matchingTestEnvironments.length !== 0;
    }

    public updateTestEnvironmentPriorityInfo(testEnvironmentId: string, priorityInfo: any): Promise<TestEnvironment> {
      return this.http.patch<TestEnvironment>(
        `${this.baseUrl}/test-environments/${testEnvironmentId}`, {
          priorityInfo,
        }).toPromise();
    }

    public updateTestEnvironmentStatus(testEnvironmentId: string, status: string, username: string): Observable<TestEnvironment> {
      const additionalInfo = `Set ${status} by ${username}`;
      return this.http.patch<TestEnvironment>(
        `${this.baseUrl}/test-environments/${testEnvironmentId}`, {
          status,
          additionalInfo,
        });
    }

    public getTestEnvironmentsByPool(poolName: string): Observable<TestEnvironment[]> {
      return this.http.get<TestEnvironment[]>(`${this.baseUrl}/test-environments/pools/${poolName}/sorted`);
    }

    public hasTestEnvironmentChangedSincePageLoad(testEnvironment: TestEnvironment): Promise<boolean> {
      return this.http.get<TestEnvironment[]>(`${this.baseUrl}/test-environments/${testEnvironment.id}`)
      .toPromise()
      .then((testEnvironmentFromDb) =>
        testEnvironmentFromDb[0].modifiedOn !== testEnvironment.modifiedOn
      ).catch((error) => Promise.reject(error));
    }
}
