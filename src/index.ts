import {AppWindow} from "./appwindow";
import * as audio from "./audio";
import {DateTime} from "luxon"

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

const ctx = canvas.getContext('2d');
if (!ctx)
    throw new Error('Could not get canvas context.');

const xx = new AppWindow(ctx);

//audio.announce("It is now [DDDD], at [tttt]. The exchange will open soon.", DateTime.local());
