export interface LocationsEntity
{
  name: string;
  timezone: string;
  color: string;
  bars: BarsEntity[];
  notifications?: NotifcationEntity[] | null;
  holidays: HolidaysEntity[];
}

export interface BarsEntity
{
  start: string;
  end: string;
  type: string;
  label: string;
}

export interface NotifcationEntity
{
  time: string;
  text: string;
}

export interface HolidaysEntity
{
  date: string;
  name: string;
  earlyClose: string;
}

export interface ZoomsEntity
{
  secondsPerPixel: number;
  major: number;
  minor: number;
  majorFormat: string;
}
