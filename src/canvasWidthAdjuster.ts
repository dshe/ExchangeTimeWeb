export class CanvasWidthAdjuster
{
  private static readonly dpr = window.devicePixelRatio || 1;
  private readonly canvas: HTMLCanvasElement;
  private readonly rows: number;
  private readonly cssBordersWidth: number;

  public constructor(canvas: HTMLCanvasElement, rows : number)
  {
    this.canvas = canvas;
    this.rows = rows;
    this.cssBordersWidth = CanvasWidthAdjuster.getCSSbordersWidthOfElement(canvas);
  }

  public adjust(): number
  {
    //console.log("dpr=" + Utility.dpr);
    const bordersWidth = this.cssBordersWidth;
    //console.log("CSSbordersWidth: " + bordersWidth);
    const w = window.innerWidth - bordersWidth;
    this.canvas.style.width = w + "px";
    this.canvas.width = w * CanvasWidthAdjuster.dpr;
    const rowHeight = 40; // calculate!!!
    const h = (2 + this.rows) * rowHeight / CanvasWidthAdjuster.dpr;
    this.canvas.style.height = h + "px";
    this.canvas.height = h * CanvasWidthAdjuster.dpr;
    console.log("adjust: " + this.canvas.width + " x " + this.canvas.height);
    return rowHeight;
  }

  private static getCSSbordersWidthOfElement(element: Element): number
  {
    const cstyles = window.getComputedStyle(element);
    let left  = cstyles.borderLeftWidth  || "0";
    let right = cstyles.borderRightWidth || "0";
    left  =  left.replace("px", "");
    right = right.replace("px", "");
    return parseInt(left) + parseInt(right);
  }

}