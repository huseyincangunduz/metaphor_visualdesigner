export class ColorConversionHelper {
    static hsv2hsl(hsv, beforeHSL = null, alpha = 255) {
        let hsl = { h: hsv.h,
            s: 0,
            l: 0 };
        let isik_t = (((2 - hsv.s) * hsv.v) / 2);
        hsl.l = Math.round(isik_t * 100) / 100; //(2 - SB.s) * SB.b / 2;
        if (hsl.l && hsl.l < 1) {
            let saturasyon_bolu = hsl.l < 0.5 ? hsl.l * 2 : 2 - hsl.l * 2;
            hsl.s = (hsv.s * hsv.v) / saturasyon_bolu;
        }
        else {
            hsl.s = beforeHSL ?
                beforeHSL.s ? beforeHSL.s : hsl.s
                :
                    hsl.s;
        }
        hsl.s = Math.round(hsl.s * 100) / 100;
        if (alpha != null && alpha != 255) {
            hsl["a"] = alpha;
        }
        return hsl;
    }
}
