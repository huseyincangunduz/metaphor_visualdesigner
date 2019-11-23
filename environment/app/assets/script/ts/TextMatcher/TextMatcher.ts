class TextMatcher
{
    
    public static matchFromFirstChar(text:string, startStr : string, until? : string) : string
    {
        let startIndex = text.indexOf(startStr);
        let lastIndex = until && text.indexOf(until) > -1 ?  text.indexOf(until) : text.length;
        if (startIndex > -1 && startIndex < lastIndex)
        {
            return TextMatcher.matchFromIndex(text,startIndex,lastIndex);
        }
        else{
            return "";
        }
    }
    public static matchFromIndex(text: string, startIndex: number, lastIndex?: number) : string {
        let txt = "";
        let m = lastIndex != null ? lastIndex : text.length
        for (let chri = 0; chri < m; chri++) {
            const element = text[chri];
            txt += element;

        }
        return txt;
    }
}

console.info(TextMatcher.matchFromFirstChar(".container #dipper.gravityFalls","#","."))