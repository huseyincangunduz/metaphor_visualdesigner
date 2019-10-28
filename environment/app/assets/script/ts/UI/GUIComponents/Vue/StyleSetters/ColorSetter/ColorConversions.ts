export class ColorConversionHelper
{
    public static hsv2hsl(hsv : {h, s, v}, alpha = 255) : {h : number,s :number,l: number}
    {
        let hsl = {h: hsv.h,
                    s: 0,
                     l:0};
        hsl.l =(((2-hsv.s) * hsv.v) / 2); //(2 - SB.s) * SB.b / 2;

        if ( hsl.l > 0 && hsl.l < 1)
        {
            hsl.s = ( (hsv.s * hsv.v) / (2 * ( hsl.l < 0.5 ? hsl.l : 2 - hsl.l ) ) );
        }
        else{
            hsl.s = hsl.s;
        }
        if (alpha != null && alpha != 255)
        {
            hsl["a"] = alpha
        }
        return hsl;
    }
    public static hsv2rgb(hsv : {h, s, v}, alpha = 255)
    {

    }
}