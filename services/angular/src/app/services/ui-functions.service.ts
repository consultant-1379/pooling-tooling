import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiFunctionsService {
    private baseUrl = environment.expressUrl;

    constructor(private http: HttpClient) { }

    public updateTestEnvironmentStatusFromQuarantineToReserved(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-quarantined-to-reserved/${testEnvironmentId}`, {
          additionalInfo: `Set Reserved by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromQuarantineToAvailable(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-quarantined-to-available/${testEnvironmentId}`, {
          additionalInfo: `Set Available by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromReservedToAvailable(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-reserved-to-available/${testEnvironmentId}`, {
          additionalInfo: `Set Available by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromReservedToQuarantine(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-reserved-to-quarantined/${testEnvironmentId}`, {
          additionalInfo: `Set Quarantine by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromStandbyToQuarantine(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-standby-to-quarantine/${testEnvironmentId}`, {
          additionalInfo: `Set Quarantine by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromStandbyToReserved(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-standby-to-reserved/${testEnvironmentId}`, {
          additionalInfo: `Set Reserved by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromStandbyToRefreshing(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-standby-to-refreshing/${testEnvironmentId}`, {
          stage: '',
          additionalInfo: `Set Refreshing by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromStandbyToAvailable(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-standby-to-available/${testEnvironmentId}`, {
          stage: '',
          additionalInfo: `Set Available by ${username}`
        }
      );
    }

    public updateTestEnvironmentStatusFromAvailableToReserved(testEnvironmentId: string, username: string): Observable<any> {
      return this.http.patch<any>(
        `${this.baseUrl}/ui-functions/test-environment-from-available-to-reserved/${testEnvironmentId}`, {
          additionalInfo: `Set Reserved by ${username}`
        }
      );
    }
}
