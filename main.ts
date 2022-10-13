enum OnOff {
    //%block="on"
    On = 0,
    //%block="off"
    Off = 1 
}

/**
 * Custom blocks
 */
//% weight=100 color=#ff8800 icon="\uf1fc"
namespace drawrobot {


    //%block="drive with $left revolutions left, and $right revolutions right"
    export function drive(left: number, right: number) {
        // IMPORTANT: buffer must correspond to application on arduino
        let driveCommand = pins.createBuffer(11);
        driveCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        driveCommand.setNumber(NumberFormat.UInt8LE, 1, 77);  // 77 => M
        driveCommand.setNumber(NumberFormat.UInt8LE, 2, 0);
        driveCommand.setNumber(NumberFormat.UInt32LE, 3, right*1000);
        driveCommand.setNumber(NumberFormat.UInt32LE, 7, left*1000);
        
        // send commend to the arduino with i2c_address=8
        pins.i2cWriteBuffer(
            8,
            driveCommand,
            false
        )
        while (isRunning()) {
            basic.pause(20);
        }
    }

    //%block="switch motors to $onoff"
    export function power(onoff: OnOff) {
        // IMPORTANT: buffer must correspond to application on arduino
        let powerCommand = pins.createBuffer(3);
        powerCommand.setNumber(NumberFormat.UInt8LE, 0, 35);  // 35 => #
        powerCommand.setNumber(NumberFormat.UInt8LE, 1, 80);  // 80 => P
        powerCommand.setNumber(NumberFormat.UInt8LE, 2, onoff);
        
        // send commend to the arduino with i2c_address=8
        pins.i2cWriteBuffer(
            8,
            powerCommand,
            false
        )
        while (isRunning()) {
            basic.pause(20);
        }
    }

    function isRunning(): boolean {
        let buffer = pins.createBuffer(1);
        buffer = pins.i2cReadBuffer(8, 1, false);
        let status = buffer.getNumber(NumberFormat.UInt8LE, 0);
        return (status == 1);
    }
}
