
import {AppWindow} from "./appwindow";
import * as audio from "./audio";
import {DateTime} from "luxon"

const element = document.getElementById('myCanvas');
if (!element)
    throw new Error('Could not get myCanvas element.');

if (!(element instanceof(HTMLCanvasElement)))
    throw new Error('myCanvas is not a canvas element.');

// 'as' is only telling the type checker to pretend something has a different type
const canvas = element as HTMLCanvasElement;

const ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Could not get canvas context.');

new AppWindow(ctx);

//audio.announce("It is now [DDDD], at [tttt]. The exchange will open soon.", DateTime.local());
