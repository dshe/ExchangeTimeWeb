export class CanvasSizeAdjuster
{
  private static readonly dpr = window.devicePixelRatio || 1;
  private readonly canvas: HTMLCanvasElement;
  private readonly height: number;
 
  public constructor(canvas: HTMLCanvasElement, height: number)
  {
    //console.log('dpr=' + CanvasSizeAdjuster.dpr);
    //console.log('window, inner size:  ' + window.innerWidth + 'x' + window.innerHeight + '.');
    //console.log('initial canvas size: ' + canvas.width + 'x' + canvas.height + '.');
    //console.log('height: ' + height);
    this.canvas = canvas;
    this.height = height;
  }
  
  public adjust(width: number): void
  {
    //console.log("dpr: " + CanvasWidthAdjuster.dpr);
    //console.log("dpr: " + window.devicePixelRatio);
    //console.log("outer: " + window.outerHeight);
    //console.log("inner: " + window.innerHeight);
    //console.log("ratio: " + window.outerHeight/window.innerHeight);
    //var parent = this.canvas.parentElement as HTMLElement;
    //var w = parent.clientWidth;
    //console.log("ww: " + w); 

    //const w = window.innerWidth - this.cssBordersWidth;
    this.canvas.width = width * CanvasSizeAdjuster.dpr;
    this.canvas.style.width = width + 'px';
    
    this.canvas.height = this.height;
    const h = this.height / CanvasSizeAdjuster.dpr;
    this.canvas.style.height = h + 'px';
    //console.log("adjust canvas css size: " + this.canvas.style.width + " x " + this.canvas.style.height);
    //console.log("adjust canvas size to:  " + this.canvas.width + " x " + this.canvas.height);
  }

}