import { DateTime, Duration } from "luxon";
import * as JsonData from './data.json';

export class Location
{
  constructor(
    public readonly name: string,
    public readonly timezone: string,
    public readonly color: string,
    public readonly bars: Bar[],
    public readonly holidays: Holiday[]) {}
}

export class Bar
{
  constructor(
    public readonly type: string, 
    public readonly start: Duration, 
    public readonly end: Duration, 
    public readonly label: string | null) {}
}

export class Holiday
{
  constructor(
    public readonly date: DateTime,
    public readonly name: string,
    public readonly earlyClose: Duration | null) {}
}

export class DataParser
{
  public static Parse(): Location[]
  {
    const locations: Location[] = [];
    const jsonDataLocations = JsonData.locations as LocationsEntity[];

    jsonDataLocations.forEach(location => 
    {   
      const bars: Bar[] = [];
      if (location.bars)
      {
        location.bars.forEach(bar =>
          bars.push(new Bar(
            bar.type, this.toDuration(bar.start), this.toDuration(bar.end), bar.label)));
      }
    
      const holidays: Holiday[] = [];
      if (location.holidays)
      {
        location.holidays.forEach(holiday =>
          holidays.push(new Holiday(
            DateTime.fromISO(holiday.date), holiday.name, this.toDuration(holiday.earlyClose))));
      }

      locations.push(new Location(
        location.name, location.timezone, location.color, bars, holidays));
    });
    
    return locations;
  }

  private static toDuration(str: string)
  {
    if (!str)
      return null;
    var parts = str.split(":");
    if (parts.length != 2 || parts[0].length != 2 || parts[1].length != 2)
      throw new Error("Invalid time: " + str + ".");
    return Duration.fromObject(
    {
      hours: + parts[0],
      minutes: + parts[1]
    });
  }
}
