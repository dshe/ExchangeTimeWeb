import { DateTime, Duration, IANAZone } from "luxon";
import { BarType } from "./enums";
import { LocationsEntity } from "./interfaces"
import * as JsonData from './data.json';

export class Location
{
  public readonly zone = new IANAZone(this.zoneName);

  public constructor(
    public readonly name: string,
    public readonly zoneName: string,
    public readonly color: string,
    public readonly bars: Bar[],
    public readonly notifications: Notification[],
    public readonly holidays: Holiday[]) {}
}

export class Bar
{
  public readonly barType: BarType;
  public readonly start: Duration;
  public readonly end: Duration;
  public constructor(barType: string, start: string, end: string, public readonly label: string) 
  {
    this.barType = (BarType as any)[barType];
    if (this.barType == undefined)
      throw new Error("Invalid barType: " + barType + ".");
    //console.log("Enum parse: " + barType + " => " + this.barType);
    this.start = DataParser.toDuration(start);      
    this.end = DataParser.toDuration(end);
  }
}

export class Notification
{
  public readonly time: Duration;
  public constructor(time: string, public readonly text: string)
  {
    this.time = DataParser.toDuration(time);
  }
}

export class Holiday
{
  public readonly date: DateTime;
  public readonly earlyClose: Duration | null = null;
  public constructor(public readonly name: string, date: string, earlyClose: string)
  {
    this.date = DateTime.fromISO(date);
    if (earlyClose != null)
      this.earlyClose = DataParser.toDuration(earlyClose);
  }
}

export class DataParser
{
  private static readonly jsonDataLocations = JsonData.locations as LocationsEntity[];

  public static Parse(): Location[]
  {
    const locations: Location[] = [];
 
    this.jsonDataLocations.forEach(location => 
    {   
      const bars: Bar[] = [];
      if (location.bars)
      {
        location.bars.forEach(b =>
          bars.push(new Bar(b.type, b.start, b.end, b.label)));
      }

      const notifications: Notification[] = [];
      if (location.notifications)
      {
        location.notifications.forEach(n =>
           notifications.push(new Notification(n.time, n.text)));
      }
    
      const holidays: Holiday[] = [];
      if (location.holidays)
      {
        location.holidays.forEach(h =>
          holidays.push(new Holiday(h.date, h.name, h.earlyClose)));
      }
      
      locations.push(new Location(
        location.name, location.timezone, location.color, bars, notifications, holidays));
    });
    
    return locations;
  }

  public static toDuration(str: string): Duration
  {
    const parts = str.split(":");
    parts.forEach(part => 
    {
      if (part.length != 2)
        throw new Error("Invalid time: " + str + ".");   
    });
    let obj: object;
    if (parts.length === 2)
    {
      obj = 
      {
        hours:   + parts[0],
        minutes: + parts[1]
      };        
     }
     else if (parts.length === 3)
     {
       obj =
       {
         hours:   + parts[0],
         minutes: + parts[1],
         seconds: + parts[2]
       };
      }
      else
        throw new Error("Invalid time: " + str + ".");
      return Duration.fromObject(obj);
  }
}
