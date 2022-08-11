

const 转换十进制=function(num){
	return parseInt(num,16)
};
const 十六进制转换十进制=function(color){
	if(!color)
		color='EEEEEE'
	return color.match(/\w\w/g).map(转换十进制)
};
const 转换十六进制=function(num){
	num=num.toString(16);
	return num.length==2?num:('0'+num)
};
const 十进制颜色转换十六进制=function(arr){
	return arr.map(转换十六进制).join('');
};




const rgb2hsl=function(o){
	var
	r=o[0],
	g=o[1],
	b=o[2];

	r /= 255, g /= 255, b /= 255;
	var
	max = Math.max(r, g, b),
	min = Math.min(r, g, b);
	var
	h,
	s,
	l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
		//h *= 60;
	}

	// h=Math.round(h*14);
	// s=Math.round(s*7);
	// l=Math.round(l*7);


	return [h, s, l];
};
const hsl2rgb=function(hsl) {
	// const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue);
	var h = hsl[0];// / 360;
	var s = hsl[1];// / 100;
	var l = hsl[2];// / 100;
	// console.log(h,s,l);
	function hue2rgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}
	var r, g, b;
	if (s == 0) {
		r = g = b = l;
	} else {
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return [
		Math.round(r*255),
		Math.round(g*255),
		Math.round(b*255)
	]
	// return `rgb(${r * 255},${g * 255},${b * 255})`;
};

const hax2burn=function(hax,burn){
	const hsl=rgb2hsl(十六进制转换十进制(hax))

	hsl[1] = hsl[1]/5 + 0.6
	hsl[2]= burn
	// console.log(hsl)
	return 十进制颜色转换十六进制(hsl2rgb(hsl))
};
const hax2light=function(hax,l){
	const hsl=rgb2hsl(十六进制转换十进制(hax))

	hsl[2]= l
	// console.log(hsl)
	return 十进制颜色转换十六进制(hsl2rgb(hsl))
};


// export {
//     十六进制转换十进制,
//     hax2burn,
//     hax2light
// }