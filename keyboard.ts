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

/**
 * User Buttons for DFRobot gamer:bit Players.
 */
//%
enum GamerBitPin {
    //% block="X button"
    P1 = <number>DAL.MICROBIT_ID_IO_P1,
    //% block="Y button"
    P2 = <number>DAL.MICROBIT_ID_IO_P2,
    //% block="D-PAD up"
    P8 = <number>DAL.MICROBIT_ID_IO_P8,
    //% block="D-PAD down"
    P13 = <number>DAL.MICROBIT_ID_IO_P13,
    //% block="D-PAD left"
    P14 = <number>DAL.MICROBIT_ID_IO_P14,
    //% block="D-PAD right"
    P15 = <number>DAL.MICROBIT_ID_IO_P15,
}

/**
 * Trigger Events Proposed by DFRobot gamer:bit Players.
 */
//%
enum GamerBitEvent {
    //% block="pressed"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    Up = DAL.MICROBIT_BUTTON_EVT_UP,
    //% block="click"
    Click = DAL.MICROBIT_BUTTON_EVT_CLICK,
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

interface KV {
    key: KeyValue;
    action: Action;
}
/**
 * Functions for DFRobot gamer:bit Players.
 */
//% weight=10 color=#DF6721 icon="\uf11b" block="keyboard"
namespace keyboard {
    let PIN_INIT = 0;
    //let kbCallback: Action = null;
    //let kbCallback:{[key:number]:Action}={}
    let kbCallback: KV[] = []

    export enum Vibrator {
        //% blockId="V0" block="stop"
        V0 = 0,
        //% blockId="V1" block="Vibration"
        V1 = 255,
    }

    export enum Intensity {
        //% blockId="I0" block="stop"
        I0 = 0,
        //% blockId="I1" block="weak"
        I1 = 100,
        //% blockId="I2" block="medium"
        I2 = 180,
        //% blockId="I3" block="strong"
        I3 = 225
    }

    export enum Led {
        //% blockId="OFF" block="off"
        OFF = 0,
        //% blockId="ON" block="on"
        ON = 1
    }


    //% shim=gamerpad::init
    function init(): void {
        return;
    }

    function PinInit(): void {
        pins.setPull(DigitalPin.P1, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P0, PinPullMode.PullUp);
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
        PIN_INIT = 1;
        return;
    }

    /**
     * To scan a button whether be triggered : return '1' if pressed; return'0' if not.
     */
    //% weight=70
    //% blockId=gamePad_keyState block="button|%button|is pressed"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    export function keyState(button: GamerBitPin): boolean {
        if (!PIN_INIT) {
            PinInit();
        }
        let num = false;
        if (0 == pins.digitalReadPin(<number>button)) {
            num = true;
        }
        return num;
    }

    /**
     * Registers code to run when a DFRobot gamer:bit event is detected.
     */
    //% weight=60
    //% blockGap=50
    //% blockId=gamePad_onEvent block="on button|%button|is %event"
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onEvent(button: GamerBitPin, event: GamerBitEvent, handler: Action) {
        init();
        if (!PIN_INIT) {
            PinInit();
        }
        control.onEvent(<number>button, <number>event, handler); // register handler
    }

    //% weight=90
    //% blockId=nfc_event block="key pressed |%value"
    export function kbEvent(value: KeyValue, a: Action) {
        let item: KV = { key: value, action: a };
        kbCallback.push(item);
    }

    /**
     * Vibration motor speed setting, adjustable range 0~255.
     */
    //% weight=30
    //% blockGap=50
    //% blockId=gamePad_vibratorMotorSpeed block="Vibrator motor intensity|%degree"
    //% degree.min=0 degree.max=255
    export function vibratorMotorSpeed(degree: number): void {
        if (!PIN_INIT) {
            PinInit();
        }
        let num = degree * 4;
        pins.analogWritePin(AnalogPin.P12, <number>num);
        return;
    }

    /**
     * LED indicator light switch.
     */
    //% weight=20
    //% blockId=gamePad_led block="LED|%index|"
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function led(index: Led): void {
        if (!PIN_INIT) {
            PinInit();
        }
        pins.digitalWritePin(DigitalPin.P16, <number>index);
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
        basic.pause(100);
    })
}