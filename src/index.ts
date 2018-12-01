
import {AppWindow} from "./appwindow";
import * as audio from "./audio";
import {DateTime} from "luxon"

const element = document.getElementById('myCanvas');
if (!element)
    throw new Error('Could not get myCanvas element.');

if (!(element instanceof(HTMLCanvasElement)))
    throw new Error('myCanvas is not a canvas element.');

const canvas = element as HTMLCanvasElement;
//if (!canvas)
//    throw new Error('Could not get canvas element.');

const ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Could not get canvas context.');

const xx = new AppWindow(ctx);

//audio.announce("It is now [DDDD], at [tttt]. The exchange will open soon.", DateTime.local());
