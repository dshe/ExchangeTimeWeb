export class Rectangle 
{
  public constructor(
    public readonly ctx: CanvasRenderingContext2D,
    public readonly x: number,
    public y: number,
    public width: number,
    public height: number) {}
  
  public changeHeight(factor: number): void
  {
    const oldHeight = this.height;
    this.height *= factor;
    this.y += (oldHeight - this.height)/2;
  }

  public fillRect(alpha: number = 1): void
  {
    const oldAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.globalAlpha = oldAlpha;
  }
  
  public fitText(text: string, color: string = "#fff"): void
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

