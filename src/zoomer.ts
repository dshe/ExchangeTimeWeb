import { ZoomsEntity } from "./interfaces"
import * as ZoomsJson from "./zooms.json"

export class Zoomer
{
  private readonly zooms = ZoomsJson as ZoomsEntity[];
  public readonly length: number;
  public index: number = -1;

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

}
