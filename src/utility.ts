export class Rectangle 
{
  constructor(
    public readonly ctx: CanvasRenderingContext2D,
    public readonly x: number,
    public y: number,
    public width: number,
    public height: number) {}
  
  public changeHeight(factor: number)
  {
    const oldHeight = this.height;
    this.height *= factor;
    this.y += (oldHeight - this.height)/2;
  }

  public fillRect(alpha: number = 1) 
  {
    const oldAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.globalAlpha = oldAlpha;
  }
  
  public fitText(text: string, color: string = "#fff")
  {
    if (!text)
      return;
    for (let str of text.split(";"))
    {
      const strWidth = this.ctx.measureText(str).width;
      if (strWidth < this.width)
      {
        const oldColor = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.fillText(str, this.x + this.width/2 , this.y + this.height/2);
        this.ctx.fillStyle = oldColor;
        return;
      }
    };
  }
}

export class Utility
{
  public static getTextSize(ctx: CanvasRenderingContext2D, text: string) :{width:number, height:number}
  {
    const m = ctx.measureText(text);
    const height = m.fontBoundingBoxAscent + m.actualBoundingBoxDescent;
    return { width : m.width, height : height};
  }

}

