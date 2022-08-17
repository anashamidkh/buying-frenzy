import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { IOperationalTime } from './interface';
import { OperationalSchedule } from './operationalSchedule.entity';

@Injectable()
export class OperationalScheduleService {
  constructor() {}

  /**
   * Parse operational schedule
   * @param {string} operationalSchedule - e.g. Mon 10:30 am - 3:15 pm / Tues - Weds 7:15 am - 12:30 am / Thurs 6:45 am - 12 am / Fri 5 am - 11:30 pm / Sat - Sun 5:30 am - 9:45 am
   * @param {number} restaurantId - e.g. 1
   * @returns {OperationalSchedule[]}
   */
  public parseOperationalSchedule(
    operationalSchedule: string,
    restaurantId?: number,
  ): OperationalSchedule[] {
    let operationalSchedules: OperationalSchedule[] = [];

    for (let scheduleItem of operationalSchedule.split('/')) {
      let splittedScheduleItem: string[] = scheduleItem.trim().split(' ');

      //Get last 5 elements of splittedScheduleItem because it will contain time range
      const timeRange: string = splittedScheduleItem.splice(-5).join('');

      const parsedTime = this.parseTimeIn24HourFormat(timeRange);
      const daysBatches = splittedScheduleItem.join('').split(',');
      daysBatches.forEach((daysBatch) => {
        if (daysBatch.indexOf('-') !== -1) {
          operationalSchedules = [
            ...operationalSchedules,
            ...this.parseDaysRange(daysBatch, parsedTime, restaurantId),
          ];
        } else {
          operationalSchedules.push(
            this.createOperationalScheduleObject(
              daysBatch,
              parsedTime.openAt,
              parsedTime.closeAt,
              restaurantId,
            ),
          );
        }
      });
    }
    return operationalSchedules;
  }

  /**
   * Parse days range
   * @param {string} daysRange - e.g. Tues-Weds
   * @param {IOperationalTime} operationalTime
   * @param {number} restaurantId - e.g.
   * @returns {OperationalSchedule[]}
   */
  private parseDaysRange(
    daysRange: string,
    operationalTime,
    restaurantId?: number,
  ): OperationalSchedule[] {
    const days = ['sun', 'mon', 'tues', 'weds', 'thurs', 'fri', 'sat'];
    let schedule = [];
    const splittedDaysRange: string[] = daysRange.split('-');
    const startDay: string = splittedDaysRange[0].trim().toLowerCase();
    const endDay: string = splittedDaysRange[1].trim().toLowerCase();

    for (let i = days.indexOf(startDay); i <= days.indexOf(endDay); i++) {
      schedule.push(
        this.createOperationalScheduleObject(
          days[i],
          operationalTime.openAt,
          operationalTime.closeAt,
          restaurantId,
        ),
      );
    }
    return schedule;
  }

  /**
   * Parse time range in 24 hour format
   * @param {string} timeRange - e.g. 10:30am-3:15pm
   * @returns {IOperationalTime}
   */
  private parseTimeIn24HourFormat(timeRange: string): IOperationalTime {
    const splittedTimeRange: string[] = timeRange.split('-');
    const openAt: string = moment(splittedTimeRange[0], ['HH:mm a']).format(
      'HH:mm:ss',
    ); //openAt in 24 hour format
    const closeAt: string = moment(splittedTimeRange[1], ['HH:mm a']).format(
      'HH:mm:ss',
    ); //closeAt in 24 hour format
    return { openAt, closeAt };
  }

  /**
   * Creates object of OperationalSchedule
   * @param {string} day - e.g. mon
   * @param {string} openAt
   * @param {string} closeAt
   * @param {number} restaurantId
   * @returns {OperationalSchedule}
   */
  private createOperationalScheduleObject(
    day: string,
    openAt: string,
    closeAt: string,
    restaurantId?: number,
  ): OperationalSchedule {
    const _operationalSchedule = new OperationalSchedule();
    _operationalSchedule.restaurantId = restaurantId;
    _operationalSchedule.day = day.trim().toLowerCase();
    _operationalSchedule.openAt = openAt;
    _operationalSchedule.closeAt = closeAt;

    return _operationalSchedule;
  }
}
