import * as FormatData from "./formats.json"

export class Format
{
  public readonly length: number = FormatData.formats.length;
  private index: number = 6;

  public get secondsPerPixel(): number
  {
    return FormatData.formats[this.index].secondsPerPixel;
  }

  public get majorFormat(): string 
  {
     return FormatData.formats[this.index].majorFormat;
  }

  public get major(): number
  {
    return FormatData.formats[this.index].major;
  }

  public get minor(): number
  {
    return FormatData.formats[this.index].minor;
  }
 
  constructor(callback: () => void)
  {
    window.onwheel = (event) => 
    {
        if (event.wheelDelta > 0 && this.index < this.length - 1)
          this.index++;
        else if (event.wheelDelta < 0 && this.index > 0)
          this.index--;
        else
          return;
        //console.log("wheel callback with index = " + this.index);
        callback();
    }
  }
}
