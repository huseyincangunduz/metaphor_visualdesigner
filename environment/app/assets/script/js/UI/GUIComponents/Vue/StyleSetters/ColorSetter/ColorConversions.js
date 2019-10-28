export class ColorConversionHelper {
    static hsv2hsl(hsv, alpha = 255) {
        let hsl = { h: hsv.h,
            s: 0,
            l: 0 };
        hsl.l = (((2 - hsv.s) * hsv.v) / 2); //(2 - SB.s) * SB.b / 2;
        if (hsl.l > 0 && hsl.l < 1) {
            hsl.s = ((hsv.s * hsv.v) / (2 * (hsl.l < 0.5 ? hsl.l : 2 - hsl.l)));
        }
        else {
            hsl.s = hsl.s;
        }
        if (alpha != null && alpha != 255) {
            hsl["a"] = alpha;
        }
        return hsl;
    }
    static hsv2rgb(hsv, alpha = 255) {
    }
}
