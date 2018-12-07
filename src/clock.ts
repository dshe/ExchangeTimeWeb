import { DateTime } from 'luxon';
import * as rxjs from 'rxjs';
import { of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';

export const Clock$ = new rxjs.Observable<DateTime>(observer =>
{
    const fcn = () => {
      observer.next(DateTime.local());
      setTimeout(fcn, 1000 - DateTime.local().millisecond);
    };

    fcn();
});
