
interface LocationsEntity
{
  name: string;
  timezone: string;
  color: string;
  bars?: (BarsEntity)[] | null;
  holidays?: (HolidaysEntity)[] | null;
}

interface BarsEntity
{
  start: string;
  end: string;
  type: string;
  label?: string | null;
}

interface HolidaysEntity
{
  date: string;
  name: string;
  earlyClose?: string | null;
}

