export class CanvasWidthAdjuster
{
  private static readonly dpr = window.devicePixelRatio || 1;
  private readonly canvas: HTMLCanvasElement;
  private readonly height: number;
  private readonly cssBordersWidth: number;
 
  public constructor(canvas: HTMLCanvasElement, height: number)
  {
    //console.log('dpr=' + CanvasWidthAdjuster.dpr);
    //console.log('window, inner size:  ' + window.innerWidth + 'x' + window.innerHeight + '.');
    //console.log('initial canvas size: ' + canvas.width + 'x' + canvas.height + '.');
    //console.log('height: ' + height);
    this.canvas = canvas;
    this.height = height;
    this.cssBordersWidth = this.getCSSbordersWidthOfElement(canvas);
    this.adjust();
  }
  
  public adjust(): void
  {
    const w = window.innerWidth - this.cssBordersWidth;
    this.canvas.width = w * CanvasWidthAdjuster.dpr;
    this.canvas.style.width = w + 'px';
    
    this.canvas.height = this.height;
    const h = this.height / CanvasWidthAdjuster.dpr;
    this.canvas.style.height = h + 'px';
    //console.log("adjust canvas css size: " + this.canvas.style.width + " x " + this.canvas.style.height);
    //console.log("adjust canvas size to:  " + this.canvas.width + " x " + this.canvas.height);
  }

  private getCSSbordersWidthOfElement(element: HTMLCanvasElement): number
  {
    const cstyles = window.getComputedStyle(element);
    let left  = cstyles.borderLeftWidth  || '0';
    let right = cstyles.borderRightWidth || '0';
    //console.log("borderLeft: " + cstyles.border);
    left  =  left.replace('px', '');
    right = right.replace('px', '');
    const width = parseInt(left) + parseInt(right);
    //console.log('CSSbordersWidth: ' + width);
    return width;
  }

}