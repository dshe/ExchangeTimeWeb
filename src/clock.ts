import { DateTime } from 'luxon';
import * as rxjs from 'rxjs';

export const Clock$ = new rxjs.Observable<DateTime>(observer =>
{
  const now = DateTime.local();
  observer.next(now);

  setTimeout(() => {
    setInterval(() => {
      observer.next(DateTime.local());
    }, 1000)
  }, 1000 - now.millisecond);

});
