import { ZoomsEntity } from "./interfaces"
import * as ZoomsJson from "./zooms.json"

export class Zoomer
{
  private readonly zooms = ZoomsJson as ZoomsEntity[];
  public readonly length: number;
  private index: number = 6;

  public constructor()
  {
    this.length = Object.keys(this.zooms).length - 1; //?
    //console.log("Zoom levels: " + this.length);
  }

  public get secondsPerPixel(): number
  {  
    return this.zooms[this.index].secondsPerPixel;
  }

  public get majorFormat(): string 
  {
     return this.zooms[this.index].majorFormat;
  }

  public get major(): number
  {
    return this.zooms[this.index].major;
  }

  public get minor(): number
  {
    return this.zooms[this.index].minor;
  }

  public updateIndex(delta: number): boolean
  {
    if (delta > 0 && this.index < this.length - 1)
      this.index++;
    else if (delta < 0 && this.index > 0)
      this.index--;
    else
      return false;
    return true;
  }

}
