import { DateTime } from "luxon";
import { Utility, Rectangle } from "./utility";
import { CanvasWidthAdjuster } from "./canvasWidthAdjuster";
import { DataParser } from "./dataParser"
import { Format } from "./formatter";

export class AppWindow
{
  private readonly locations = DataParser.Parse();
  private readonly fontName = "arial";
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly formatter: Format;
  private readonly canvasWidthAdjuster: CanvasWidthAdjuster;
  private rowHeight: number;
  private now: DateTime;
  private originSeconds: number;

  constructor(canvas : HTMLCanvasElement)
  { 
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');    
    this.canvasWidthAdjuster = new CanvasWidthAdjuster(canvas, this.locations.length);
    this.formatter = new Format(() => this.draw());
    this.rowHeight = this.canvasWidthAdjuster.adjust();
    this.draw();
    window.onresize = () => 
    {
      this.rowHeight = this.canvasWidthAdjuster.adjust();
      this.draw();
    }
    setInterval(() => this.draw(), 1000);
  }

  public draw()
  {
    this.now = DateTime.local();
    this.now = DateTime.fromISO("2020-07-20T11:30");

    this.originSeconds = this.now.toMillis() / 1000 - this.formatter.secondsPerPixel * this.canvas.width / 3; 
    //console.log("orginSeconds: "+ this.originSeconds);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTopRow();
    this.drawTicks();
    this.drawRows();
    this.drawCursor();
    //Notify(instant);
  }

  private drawTopRow()
  {
    // fill top row
    this.ctx.fillStyle = "#444";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.rowHeight);
    
    // configure font
    const fontSize = this.rowHeight * .8;
    this.ctx.font = fontSize + "px " + this.fontName;
    //console.log("Font: " + this.ctx.font);
    this.ctx.fillStyle = "#DDD";
    this.ctx.textBaseline = 'middle';
  
    // draw timezone on left
    const y = this.rowHeight / 2;
    this.ctx.textAlign = 'left';
    this.ctx.fillText(this.now.zoneName, 3, y);
    
    // draw date in center
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.now.toLocaleString(DateTime.DATE_HUGE), this.canvas.width/2, y);
  
    // draw time on right
    this.ctx.textAlign = 'right';
    this.ctx.fillText(this.now.toLocaleString(DateTime.TIME_24_WITH_SECONDS), this.canvas.width - 3, y);
  }

  private drawTicks()
  {
    const fontSize = this.rowHeight * .6;
    this.ctx.font = fontSize + "px " + this.fontName;
    this.ctx.textAlign = "center";
    //console.log("ticks font: " + this.ctx.font);
    
    const firstSeconds = this.originSeconds - (this.originSeconds % this.formatter.minor) + this.formatter.minor;
    //console.log("firstSeconds: " + firstSeconds);
    for (let s = firstSeconds; s - firstSeconds <= this.canvas.width * this.formatter.secondsPerPixel; s += this.formatter.minor)
    {
      //console.log("s: " + this.Str(s));
      const dt = DateTime.fromMillis(s * 1000); // local
      var px = (s - this.originSeconds) / this.formatter.secondsPerPixel;
      const factor = this.formatter.major == 10800 || this.formatter.major == 21600 ? 3600 : 0;
      if ((s + factor) % this.formatter.major == 0) // && (this.formatter.secondsPerPixel < 3600 || dt.weekday == 1))
      {
        const text = dt.toFormat(this.formatter.majorFormat);
        const size = Utility.getTextSize(this.ctx, text);
        const width = size[0] + 4;
        //console.log("width:" + width);  
        const height = size[1];
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

  private drawRows()
  {      
    const fontSize = this.rowHeight * .6;
    this.ctx.font = fontSize + "px " + this.fontName;
    //console.log("Font: " + this.ctx.font);
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';

    const originInstant = DateTime.fromMillis(this.originSeconds * 1000);
    const endInstant = DateTime.fromMillis((this.originSeconds + this.formatter.secondsPerPixel * this.canvas.width)*1000);
    let y = this.rowHeight * 2;

    this.locations.forEach(location =>
    {
      this.ctx.fillStyle = location.color;

      //console.log("location: " + location.name);
      const dt1 = originInstant.setZone(location.timezone).startOf('day');
      const dt2 =    endInstant.setZone(location.timezone).endOf('day');;
      //console.log("dt1: " + dt1.toString() + "\ndt2: " + dt2.toString());
      //Debug.Assert(dt1 < dt2);

      if (dt1.weekday == 7) // sunday
        this.drawBar(y, dt1, dt1.plus({days:1}), "Weekend", "Sunday;Sun;S");
      for (let dt = dt1; dt < dt2; dt = dt.plus({days:1}))
      {
        //console.log("dt: " + dt);
        if (dt.weekday == 6) // saturday
          this.drawBar(y, dt, dt.plus({ days:2 }), "Weekend", "Weekend;W");
        if (dt.weekday == 6 || dt.weekday == 7) // skip Sundays; 2 days from Saturday covers the Weekend
          continue;

        const holiday = location.holidays.find(h => h.date == dt1);
        const earlyClose = holiday && holiday.earlyClose;
        if (holiday)
        {
          var d = earlyClose ? dt.plus(earlyClose) : dt;
          this.drawBar(y, d, dt.plus({ days:1}), "Holiday", "Holiday: " + holiday.name + ";Holiday;H");
          if (!earlyClose)
            continue;
        }
        
        for (let bar of location.bars)
        {
          //console.log("duration: " + bar.start)
          const start = dt.plus(bar.start);
          const end = dt.plus(earlyClose || bar.end);        
          let label = bar.label;
          if (!label)
            label = location.name + " TIME";
          if (label.includes("TIME"))
            label = label.replace(/TIME/gi, this.now.setZone(location.timezone).toFormat("H:mm"));
          //this.ctx.fillStyle = location.color;
          this.drawBar(y, start, end, bar.type, label);
          //console.log("label: " + label)
        }
      }
      y += this.rowHeight;
    });
  }

  private drawBar(y: number, start: DateTime, end: DateTime, type: string, label: string)
  {  
    if (start >= end)
        end = end.plus({days: 1});
    if (start >= end)
        return;
    //console.log("start: " + start + ", end: " + end);

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
    //console.log("x1: " + x1 + ", x2: " + x2);

    const rect = new Rectangle(this.ctx, x1, y, x2 - x1 + 1, this.rowHeight);

    switch (type)
    {
        case "Holiday":
        case "Weekend":
          rect.fillRect(.5);
          rect.fitText(label, "#ddd");
          break;
        case "L":          
          rect.fillRect(.9);
          if (this.formatter.secondsPerPixel < 1800)
            rect.fitText(label, "#ddd");
          break;
        case "M":
          rect.changeHeight(.3);
          rect.fillRect(.9);
          break;
        case "S":
          rect.changeHeight(.1);
          rect.fillRect(.9);
          break;
        default:
          console.log("Invalid bar type: " + type);
    }
  }

  private drawCursor()
  {   
    // show gold line indicating the current point in time
    this.ctx.fillStyle = "gold";
    this.ctx.fillRect(this.canvas.width / 3, this.rowHeight * 1.7, 2, this.canvas.height);
  }

  private dateToPixels(dt: DateTime): number
  {
    var seconds = dt.toMillis()/1000;
    var px = (seconds - this.originSeconds) / this.formatter.secondsPerPixel;
    return px;
  }
  
}
