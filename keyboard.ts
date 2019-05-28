/*！
 * @file gamePad/main.ts
 * @brief DFRobot's gamer pad makecode library.
 * @n [Get the module here](http://www.dfrobot.com.cn/goods-1577.html)
 * @n This is the microbit dedicated handle library, which provides an API to 
 * control eight buttons, including an led indicator light and a vibrating motor.
 *
 * @copyright	[DFRobot](http://www.dfrobot.com), 2016
 * @copyright	GNU Lesser General Public License
 *
 * @author [email](1035868977@qq.com)
 * @version  V1.0
 * @date  2018-03-20
 */

enum KeyMode {
    //% block=function
    Function = 0,
    //% block=number
    Number = 1
}

//%
enum KeyValue {
    //% block="key 1"
    key1 = 0x80,
    //% block="key 2"
    key2 = 0x40,
    //% block="key 3"
    key3 = 0x20,
    //% block="key +"
    keyplus = 0x10,
    //% block="key 4"
    key4 = 0x200,
    //% block="key 5"
    key5 = 0x100,
    //% block="key 6"
    key6 = 0x400,
    //% block="key -"
    keyminus = 0x800,
    //% block="key 7"
    key7 = 0x4000,
    //% block="key 8"
    key8 = 0x1000,
    //% block="key 9"
    key9 = 0x2000,
    //% block="key *"
    keymul = 0x8000,
    //% block="key DF"
    keydf = 0x01,
    //% block="key 0"
    key0 = 0x02,
    //% block="key ="
    keyequal = 0x04,
    //% block="key /"
    keydiv = 0x08
}
enum NeoPixelColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}
interface KV {
    key: KeyValue;
    action: Action;
}
/**
 * Functions for DFRobot gamer:bit Players.
 */
//% weight=10 color=#DF6721 icon="\uf11b" block="keyboard"
namespace keyboard {
    let kbCallback: KV[] = []
    let neopixel_buf = pins.createBuffer(16 * 3);
    let _brightness = 255
    let mathKeyNumber = 0
    let mathKeyFunction = 'x'
    for (let i = 0; i < 16 * 3; i++) {
        neopixel_buf[i] = 0
    }

    //% weight=94
    //% blockId=led_range block="led range from|%from to|%to"
    export function ledRange(from: number, to: number): number {
        return (from << 16) + (2 << 8) + (to);
    }

    //% weight=93
    //% blockId=set_index_color block="set color index |%index|%rgb"
    export function setIndexColor(index: number, rgb: NeoPixelColors) {
        let f = index;
        let t = index;
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);

        if (index > 15) {
            f = index >> 16;
            t = index & 0xff;
        }
        for (let i = f; i <= t; i++) {
            neopixel_buf[i * 3 + 0] = Math.round(g)
            neopixel_buf[i * 3 + 1] = Math.round(r)
            neopixel_buf[i * 3 + 2] = Math.round(b)
            ws2812b.sendBuffer(neopixel_buf, DigitalPin.P15)
        }
    }

    //% weight=92
    //% blockId=led_rainbow block="led rainbow led from|%startLed to|%endLed color from|%startHue to|%endHue"
    export function ledRainbow(startLed: number, endLed: number, startHue: number, endHue: number) {
        if(startLed>endLed){
            return
        }
        startHue = startHue >> 0;
        endHue = endHue >> 0;
        const saturation = 100;
        const luminance = 50;
        let steps = endLed-startLed+1;
        const direction = HueInterpolationDirection.Clockwise;

        //hue
        const h1 = startHue;
        const h2 = endHue;
        const hDistCW = ((h2 + 360) - h1) % 360;
        const hStepCW = Math.idiv((hDistCW * 100), steps);
        const hDistCCW = ((h1 + 360) - h2) % 360;
        const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
        let hStep: number;
        if (direction === HueInterpolationDirection.Clockwise) {
            hStep = hStepCW;
        } else if (direction === HueInterpolationDirection.CounterClockwise) {
            hStep = hStepCCW;
        } else {
            hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
        }
        const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

        //sat
        const s1 = saturation;
        const s2 = saturation;
        const sDist = s2 - s1;
        const sStep = Math.idiv(sDist, steps);
        const s1_100 = s1 * 100;

        //lum
        const l1 = luminance;
        const l2 = luminance;
        const lDist = l2 - l1;
        const lStep = Math.idiv(lDist, steps);
        const l1_100 = l1 * 100
        serial.writeString("h1 = ");
        serial.writeNumber(h1);
        serial.writeLine("");
        serial.writeString("s1 = ");
        serial.writeNumber(s1);
        serial.writeLine("");
        serial.writeString("l1 = ");
        serial.writeNumber(l1);
        serial.writeLine("");
        serial.writeString("hStep = ");
        serial.writeNumber(hStep);
        serial.writeLine("");
        serial.writeString("sStep = ");
        serial.writeNumber(sStep);
        serial.writeLine("");
        serial.writeString("lStep = ");
        serial.writeNumber(lStep);
        serial.writeLine("");

        serial.writeString("startHue = ");
        serial.writeNumber(startHue);
        serial.writeLine("");
        serial.writeString("endHue = ");
        serial.writeNumber(endHue);
        serial.writeLine("");
        serial.writeString("steps = ");
        serial.writeNumber(steps);
        serial.writeLine("");
        //interpolate
        if (steps === 1) {
            writeBuff(startLed, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
        } else {
            writeBuff(startLed, hsl(startHue, saturation, luminance));
            for (let i = 1; i < steps - 1; i++) {
                const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                const s = Math.idiv((s1_100 + i * sStep), 100);
                const l = Math.idiv((l1_100 + i * lStep), 100);
                writeBuff(startLed+i, hsl(h, s, l));
            }
            writeBuff(endLed, hsl(endHue, saturation, luminance));
        }
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P15)
    }

    //% weight=91
    //% blockId=show_color block="show color |%rgb"
    export function showColor(rgb: NeoPixelColors) {
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);
        for (let i = 0; i < 16 * 3; i++) {
            if ((i % 3) == 0)
                neopixel_buf[i] = Math.round(g)
            if ((i % 3) == 1)
                neopixel_buf[i] = Math.round(r)
            if ((i % 3) == 2)
                neopixel_buf[i] = Math.round(b)
        }
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P15)
    }
    //% weight=97
    //% blockId=key_math block="key(math) |%mode"
    //export function key_math(mode:KeyMode): number {
      //let key = key_basic();

    //if(mode == KeyMode.Number)
    //    return mathKeyNumber
    //else
    //    return mathKeyFunction
    //}
    //% weight=98
    //% blockId=key_basic block="key(basic)"
    export function key_basic():number {
        let tab = [0x02,0x80,0x40,0x20,0x200,0x100,0x400,0x4000,
             0x1000,0x2000,0x10,0x800,0x8000,0x08,0x04,0x01]

        let TPval = pins.i2cReadNumber(0x57, NumberFormat.UInt16BE);
        let key = 16;
        for(let i=0;i<16;i++){
            if(TPval & tab[i]){
                key = i;
                break;
            }
        }
        return key;
    }

    //% weight=91
    //% blockId=show_matrix_color block="show matrix pixel x|%x y|%y color|%rgb"
    export function showMatrixColor(x:number, y:number, rgb: NeoPixelColors) {
        let matrix=[[1,2,3,10],[4,5,6,11],[7,8,9,12],[15,0,14,13]]
        let index = matrix[y][x]
        writeBuff(index,rgb)
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P15)
    }
    function writeBuff(index:number, rgb: number) {
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);
        neopixel_buf[index * 3 + 0] = Math.round(g)
        neopixel_buf[index * 3 + 1] = Math.round(r)
        neopixel_buf[index * 3 + 2] = Math.round(b)
    }

    //% weight=92
    //% blockId=set_brightness block="set brightness |%brightness"
    export function setBrightness(brightness: number) {
        _brightness = brightness;
    }
    //% weight=90
    //% blockId=kb_event block="key pressed |%value"
    export function kbEvent(value: KeyValue, a: Action) {
        let item: KV = { key: value, action: a };
        kbCallback.push(item);
    }
    //% weight=89
    //% blockId=led_blank block="turn off all leds"
    export function ledBlank() {
        showColor(0)
    }

    function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;

        return (r<<16) + (g<<8) + b;
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }

    basic.forever(() => {
        if (kbCallback != null) {
            let TPval = pins.i2cReadNumber(0x57, NumberFormat.UInt16BE);
            if (TPval != 0) {
                for (let item of kbCallback) {
                    if (item.key & TPval) {
                        item.action();
                    }
                }
                serial.writeString("TPVal = ");
                serial.writeNumber(TPval);
                serial.writeLine("");
            }
        }
        basic.pause(1000);
    })
}