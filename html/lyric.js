const isLyricLine = /^\[(\d+)\:(\d+(?:\.\d+))\](.+?)(?:「(.+)」)?$/;

const lyricParse = (text)=>{
    let lyrics = [];
    text.trim().split(/\s{0,}\n\s{0,}/g).forEach(t=>{
        const match = t.match(isLyricLine);
        if(!match) return;
        const [_,mm,ss,text,cn] = match;
        const s = mm * 60 + Number(ss);
        lyrics.push([
            s,
            text.trim(),
            cn?cn.trim():''
        ]);
    });
    return lyrics.sort((a,b)=>b[0]<a[0]?1:-1);
};