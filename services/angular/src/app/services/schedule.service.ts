import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
    private baseUrl = environment.expressUrl;

    constructor(private http: HttpClient) { }

    public getSchedule(id: string): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(`${this.baseUrl}/schedules/${id}`);
    }

    public getSchedules(): Observable<Schedule[]> {
      return this.http.get<Schedule[]>(`${this.baseUrl}/schedules`);
    }

    public removeSchedule(scheduleToRemove: Schedule): Observable<Schedule> {
      return this.http.delete<any>(`${this.baseUrl}/schedules/${scheduleToRemove.id}`);
    }

    public getScheduleByName(name: string): Observable<Schedule[]> {
      return this.http.get<Schedule[]>(`${this.baseUrl}/schedules/name/${name}`);
    }

    public addSchedule(scheduleToAdd: Schedule): Promise<Schedule> {
      return this.http.post<Schedule>(`${this.baseUrl}/schedules/`, scheduleToAdd)
        .toPromise();
    }

    public patchSchedule(scheduleToPatch: Schedule): Promise<Schedule> {
      return this.http.patch<Schedule>(`${this.baseUrl}/schedules/${scheduleToPatch.id}`,
        scheduleToPatch).toPromise();
    }

    public async checkIfScheduleExists(scheduleName: string): Promise<boolean> {
      const matchingSchedules = await this.getScheduleByName(scheduleName).toPromise();
      return matchingSchedules.length !== 0;
    }

    public updateScheduleEnabledStatus(scheduleId: string, scheduleEnabled: boolean): Observable<Schedule> {
      return this.http.patch<Schedule>(
        `${this.baseUrl}/schedules/${scheduleId}`, {
          scheduleEnabled,
        });
    }

}
