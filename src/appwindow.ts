import { DateTime } from 'luxon';
import * as rxjs from 'rxjs';
import { map, tap, filter, throttleTime } from 'rxjs/operators';
import { BarType } from './enums';
import { Rectangle } from "./rectangle";
import { CanvasWidthAdjuster } from "./canvasWidthAdjuster";
import { DataParser } from "./dataParser";
import { Zoomer } from "./zoomer";

export class AppWindow
{
  private readonly locations = DataParser.Parse();
  private readonly fontName = "arial";
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly zoomer: Zoomer = new Zoomer();
  private readonly canvasWidthAdjuster: CanvasWidthAdjuster;
  private readonly rowHeight: number = 40;
  private now: DateTime = DateTime.local();
  private originSeconds: number = 0;

  public constructor(ctx : CanvasRenderingContext2D)
  { 
    this.ctx = ctx;
    this.canvas = ctx.canvas;

    const height = (2 + this.locations.length) * this.rowHeight;
    this.canvasWidthAdjuster = new CanvasWidthAdjuster(ctx.canvas, height);
    this.draw();
    
    const tick = rxjs.interval(1000)
      .pipe(map(x => "tick"));

    const resize = rxjs.fromEvent<Event>(window, 'resize')
      .pipe(throttleTime(50, undefined, { leading: true, trailing: true } ))
      .pipe(tap(() => this.canvasWidthAdjuster.adjust()))
      .pipe(map(() => "resize"));

    const zoom = rxjs.fromEvent<WheelEvent>(document, "wheel")
      .pipe(filter(event => event.ctrlKey === true))
      .pipe(map(event => event.wheelDelta))
      .pipe(filter(delta => this.zoomer.updateIndex(delta) === true))
      .pipe(map(() => "zoom"));
  
    rxjs.merge<string,string, string>(resize, zoom, tick)
      //.pipe(throttleTime(20, undefined, { leading: true, trailing: true }))
      .subscribe((x) =>
      {
        //console.log("draw: " + x);
        this.draw();
      });
  }

  public draw(): void
  {
    //now = DateTime.fromISO("2020-07-20T11:30");
    this.now = DateTime.local();
    this.originSeconds = this.now.toMillis() / 1000 - this.zoomer.secondsPerPixel * this.canvas.width / 3; 
    //console.log("orginSeconds: "+ this.originSeconds);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTopRow();
    this.drawTicks();
    this.drawRows();
    this.drawCursor();
    //Notify(instant);
  }

  private drawTopRow(): void
  {
    // fill top row
    this.ctx.fillStyle = "#444";
    this.ctx.fillRect(0, 0, this.canvas.width, this.rowHeight);
    
    // configure font
    const fontSize = this.rowHeight * .8;
    this.ctx.font = fontSize + "px " + this.fontName;
    //console.log("Font: " + this.ctx.font);
    this.ctx.fillStyle = "#DDD";
    this.ctx.textBaseline = 'middle';
  
    // draw timezone on left
    const y = this.rowHeight / 2;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(this.now.zoneName, 6, y);
    
    // draw date in center
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.now.toLocaleString(DateTime.DATE_HUGE), this.canvas.width/2, y);
  
    // draw time on right
    this.ctx.textAlign = 'right';
    this.ctx.fillText(this.now.toLocaleString(DateTime.TIME_24_WITH_SECONDS), this.canvas.width - 6, y);
  }

  private drawTicks(): void
  {
    const fontSize = this.rowHeight * .6;
    this.ctx.font = fontSize + "px " + this.fontName;
    this.ctx.textAlign = "center";
    //console.log("ticks font: " + this.ctx.font);
    
    const firstSeconds = this.originSeconds - (this.originSeconds % this.zoomer.minor) + this.zoomer.minor;
    //console.log("firstSeconds: " + firstSeconds);
    for (let s = firstSeconds; s - firstSeconds <= this.canvas.width * this.zoomer.secondsPerPixel; s += this.zoomer.minor)
    {
      //console.log("s: " + this.Str(s));
      const dt = DateTime.fromMillis(s * 1000); // local
      const px = (s - this.originSeconds) / this.zoomer.secondsPerPixel;
      const factor = this.zoomer.major === 10800 || this.zoomer.major === 21600 ? 3600 : 0;
      if ((s + factor) % this.zoomer.major === 0) // && (this.formatter.secondsPerPixel < 3600 || dt.weekday === 1))
      {
        const text = dt.toFormat(this.zoomer.majorFormat);
        const width = this.ctx.measureText(text).width + 4; 
        this.ctx.fillStyle = "#999";
        //console.log("px: "+ px + ", width: " + width);
        if (px - width/2 > 0 && px + width/2 < this.canvas.width)
          this.ctx.fillText(text, px, this.rowHeight * 1.4);
        this.ctx.fillStyle = "#999";
        this.ctx.fillRect(px, this.rowHeight * 1.7, 1, this.canvas.height);
      }
      else // minor
      {
        this.ctx.fillStyle = "#666";
        this.ctx.fillRect(px, this.rowHeight * 1.8, 1, this.canvas.height);
      }
    }
  }

  private drawRows(): void
  {      
    const fontSize = this.rowHeight * .6;
    this.ctx.font = fontSize + 'px ' + this.fontName;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    const originInstant = DateTime.fromMillis(this.originSeconds * 1000);
    const endInstant = DateTime.fromMillis((this.originSeconds + this.zoomer.secondsPerPixel * this.canvas.width)*1000);
    let y = this.rowHeight * 2;

    this.locations.forEach(location =>
    {
      //console.log("location: " + location.name);
      this.ctx.fillStyle = location.color;
      const zonedNow = this.now.setZone(location.zone).toFormat('H:mm');
      const dt1 = originInstant.setZone(location.zone).startOf('day');
      const dt2 =    endInstant.setZone(location.zone).endOf('day');

      if (dt1.weekday === 7) // sunday
        this.drawBar(y, dt1, dt1.plus({days:1}), BarType.Weekend, "Sunday;Sun;S");
      for (let dt = dt1; dt < dt2; dt = dt.plus({days:1}))
      {
        //console.log("dt: " + dt);
        if (dt.weekday === 6) // saturday
          this.drawBar(y, dt, dt.plus({ days:2 }), BarType.Weekend, "Weekend;W");
        if (dt.weekday === 6 || dt.weekday === 7) // skip Sundays; 2 days from Saturday covers the Weekend
          continue;

        const holiday = location.holidays.find(h => h.date === dt1);
        const earlyClose = holiday && holiday.earlyClose;
        if (holiday)
        {
          const d = earlyClose ? dt.plus(earlyClose) : dt;
          this.drawBar(y, d, dt.plus({ days:1}), BarType.Holiday, "Holiday: " + holiday.name + ";Holiday;H");
          if (!earlyClose)
            continue;
        }
        
        for (let bar of location.bars)
        {
          const start = dt.plus(bar.start);
          const end = dt.plus(earlyClose || bar.end);
          let label = bar.label;
          if (!label)
            label = location.name + " TIME";
          if (label.includes("TIME"))
            label = label.replace(/TIME/gi, zonedNow);
          this.drawBar(y, start, end, bar.barType, label);
          //console.log("label: " + label)
        }
      }
      y += this.rowHeight;
    });
  }

  private drawBar(y: number, start: DateTime, end: DateTime, barType: BarType, label: string): void
  {  
    if (start >= end)
        end = end.plus({days: 1});
    if (start >= end)
        return;

    let x1 = this.dateToPixels(start);
    let x2 = this.dateToPixels(end);   
    if (x1 <= 0)
        x1 = 0;
    else if (x1 >= this.canvas.width)
        return;
    if (x2 >= this.canvas.width)
        x2 = this.canvas.width - 1;
    if (x2 < 0)
        return;

    const rect = new Rectangle(this.ctx, x1, y, x2 - x1 + 1, this.rowHeight);

    switch (barType)
    {
        case BarType.Holiday:
        case BarType.Weekend:
          rect.fillRect(.5);
          rect.fitText(label, "#ddd");
          break;
        case BarType.L:
          rect.fillRect(.9);
          if (this.zoomer.secondsPerPixel < 1800)
            rect.fitText(label, "#ddd");
          break;
        case BarType.M:
          rect.changeHeight(.3);
          rect.fillRect(.9);
          break;
        case BarType.S:
          rect.changeHeight(.1);
          rect.fillRect(.9);
    }
  }

  private drawCursor(): void
  {   
    // show gold line indicating the current point in time
    this.ctx.fillStyle = "gold";
    this.ctx.fillRect(this.canvas.width / 3, this.rowHeight * 1.7, 2, this.canvas.height);
  }

  private dateToPixels(dt: DateTime): number
  {
    const seconds = dt.toMillis()/1000;
    const px = (seconds - this.originSeconds) / this.zoomer.secondsPerPixel;
    return px;
  }
  
}
