/**
 * @author itorr<https://github.com/itorr>
 * @date 2022-06-01
 * @Description One Last Image
 * */



const randRange = (a, b) => Math.floor(Math.random() * (b - a) + a);

const inputImageEl = document.querySelector('#input');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas)

let width = 640;
let height = 480;
let scale = width / height;



let lastConfigString = null;


const canvasBlack = document.createElement('canvas');
const canvasBlackMin = document.createElement('canvas');
const canvasMin = document.createElement('canvas');

const louvre = (img, config, callback) => {
	if (!img || !config) return;

	const configString = [
		JSON.stringify(config),
		img.src,
	].join('-');

	if (lastConfigString === configString) return;

	console.time('louvre');

	lastConfigString = configString;

	const oriWidth = img.naturalWidth;
	const oriHeight = img.naturalHeight;

	let oriScale = oriWidth / oriHeight;



	// const _width  = Math.floor( width  / config.zoom );
	// const _height = Math.floor( height / config.zoom );

	let _width  = Math.floor( oriWidth   / config.zoom );
	let _height = Math.floor( oriHeight  / config.zoom );

	const maxWidth = 1200;
	if(_width > maxWidth){
		_height = _height * maxWidth / _width
		_width = maxWidth
	}
	// const _width = 800;
	// const _height = 800;


	canvas.width = _width;
	canvas.height = _height;

	let cutLeft = 0;
	let cutTop = 0;

	let calcWidth = oriWidth;
	let calcHeight = oriHeight;


	// if(oriScale > 1){
	// 	cutLeft = (oriScale - 1) * oriHeight / 2;
	// 	calcWidth = oriHeight;
	// }else{
	// 	cutTop =  (1 - oriScale) * oriHeight / 2;
	// 	calcHeight = oriWidth;
	// }

	let setLeft = 0;
	let setTop = 0;

	let setWidth = _width;
	let setHeight = _height;




	ctx.drawImage(
		img,
		cutLeft, cutTop,
		calcWidth, calcHeight,

		setLeft, setTop,
		setWidth, setHeight
	);


	let pixel = ctx.getImageData(0, 0, _width, _height);



	let pixelData = pixel.data;


	for (let i = 0; i < pixelData.length; i += 4) {
		// let yuv = rgb2yuv(
		// 	pixelData[i],
		// 	pixelData[i + 1],
		// 	pixelData[i + 2],
		// );
		const r = pixelData[i];
		const g = pixelData[i + 1];
		const b = pixelData[i + 2];
		
		let y = r * .299000 + g * .587000 + b * .114000;
		y = Math.floor(y);

		// if(i%10000) console.log(y);

		pixelData[i    ] = y;
		pixelData[i + 1] = y;
		pixelData[i + 2] = y;
	}
	let blackPixel;

	if(config.black){
		// 处理暗面
		blackPixel = ctx.createImageData(_width, _height);

		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = y > 80 ? 0 : (40 + Math.random() * 40 - 20);

			// y = Math.max(255-y) * 0.6;

			blackPixel.data[i    ] = y;
			blackPixel.data[i + 1] = 128;
			blackPixel.data[i + 2] = 128;
			blackPixel.data[i + 3] = Math.floor(Math.random() * 255)//Math.ceil( y + Math.random() * 40 - 20);
		}

		// /*
		// document.body.appendChild(canvasBlack)

		const ctxBlack = canvasBlack.getContext('2d');
		const ctxBlackMin = canvasBlackMin.getContext('2d');
		
		canvasBlack.width = _width;
		canvasBlack.height = _height;

		console.log({blackPixel})

		ctxBlack.putImageData(blackPixel, 0, 0);

		// ctxBlack.fillText('123233',50,50);
		const blackZoom = 4;
		canvasBlackMin.width = Math.floor(_width/blackZoom);
		canvasBlackMin.height = Math.floor(_height/blackZoom);

		ctxBlackMin.drawImage(
			canvasBlack,
			0,0,
			canvasBlackMin.width,canvasBlackMin.height
		);

		ctxBlack.clearRect(0,0,_width,_height)
		ctxBlack.drawImage(
			canvasBlackMin,
			0,0,
			_width,_height
		);
		blackPixel = ctxBlack.getImageData(0,0,_width,_height);

	}
	
	const { 
		light = 0,
	} = config;
	if(light){

		
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = y + y * (light/100);
	
			pixelData[i    ] = y;
			pixelData[i + 1] = y;
			pixelData[i + 2] = y;
		}

		// ctx.putImageData(pixel, 0, 0);
		// pixel = ctx.getImageData(0, 0, _width, _height);
	}




	let pixel1 = config.convoluteName ? convoluteY(
		pixel,
		config.Convolutes[config.convoluteName]
	) : pixel;

	// if(config.contrast){
	// 	for (let i = 0; i < pixel1.data.length; i +=4) {
	// 		let r = (pixel1.data[i]-128) * config.contrast + 128;
	// 		pixel1.data[i  ] = r;
	// 		pixel1.data[i+1] = r;
	// 		pixel1.data[i+2] = r;
	// 		pixel1.data[i+3] = 255;
	// 	}
	// }

	if(config.convolute1Diff){
		let pixel2 = config.convoluteName2 ? convoluteY(
			pixel,
			config.Convolutes[config.convoluteName2]
		) : pixel;
		
		console.log(/pixel2/,config.Convolutes[config.convoluteName2],pixel2);
		// pixelData
		for (let i = 0; i < pixel2.data.length; i +=4) {
			let r = 128 + pixel2.data[i  ] - pixel1.data[i  ];
			pixel2.data[i  ] = r;
			pixel2.data[i+1] = r;
			pixel2.data[i+2] = r;
			pixel2.data[i+3] = 255;
		}
		pixel = pixel2;
	}else{
		// 不对比
		pixel = pixel1;
	}

	pixelData = pixel.data;

	if(config.invertLight){
		for (let i = 0; i < pixelData.length; i += 4) {
			let r = 255 - pixelData[i]
			pixelData[i   ] = r
			pixelData[i+1 ] = r
			pixelData[i+2 ] = r
		}
	}

	if(config.lightGroup!==1){
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			const isOdd = Math.floor(y / (255/config.lightGroup)) % 2 === 0; 
			

			y = y % (255/config.lightGroup) * config.lightGroup;

			if(isOdd) y = 255 - y;

			pixelData[i+0 ] = y
			pixelData[i+1 ] = y
			pixelData[i+2 ] = y
		}
	}


	if(config.lightCut || config.darkCut){
		const scale = 255 / (255 - config.lightCut - config.darkCut);
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i];

			y = (y - config.darkCut) * scale;
			
			y = Math.max(0,y);
			
			pixelData[i+0 ] = y
			pixelData[i+1 ] = y
			pixelData[i+2 ] = y
			pixelData[i+3 ] = 255
		}
	}
	const hStart = 30;
	const hEnd = -184;

	const be = bezier(0.57, 0.01, 0.43, 0.99);
	const s = config.s/100;


	const gradient = ctx.createLinearGradient(0,0, _width,_height);

	// Add three color stops
	gradient.addColorStop(0, '#fbba30');
	gradient.addColorStop(0.4, '#fc7235');
	gradient.addColorStop(.6, '#fc354e');
	gradient.addColorStop(0.7, '#cf36df');
	gradient.addColorStop(.8, '#37b5d9');
	gradient.addColorStop(1, '#3eb6da');

	// Set the fill style and draw a rectangle
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, _width, _height);
	let gradientPixel = ctx.getImageData(0, 0, _width, _height);
	
	for (let i = 0; i < pixelData.length; i += 4) {
		let y = pixelData[i];
		let p = Math.floor(i / 4);

		let _h = Math.floor(p/_width);
		let _w = p % _width;

		/*
		
		// const 
		// hScale = hScale * hScale;

		let hScale = (_h + _w)/(_width + _height);

		hScale = hScale * hScale;
		hScale = be(hScale);

		// let h = Math.floor((hStart + (hScale) * (hEnd - hStart)));
		let [h] = rgb2hsl([
			gradientPixel.data[i + 0],
			gradientPixel.data[i + 1],
			gradientPixel.data[i + 2],
		]);
		const l = y/255;
		const rgb = hsl2rgb([h, s, l * (1 - config.l/100) + (config.l/100)]);

		if(i%5677===0){
			// console.log(h,y,l,l * (config.l/100) + (1 - config.l/100))
			// console.log((_h + _w)/(_width + _height),hScale)
		}

		pixelData[i+0 ] = rgb[0];
		pixelData[i+1 ] = rgb[1];
		pixelData[i+2 ] = rgb[2];
		pixelData[i+3 ] = 255;
		*/

		pixelData[i+0 ] = gradientPixel.data[i + 0];
		pixelData[i+1 ] = gradientPixel.data[i + 1];
		pixelData[i+2 ] = gradientPixel.data[i + 2];
		
		y = 255 - y;
		if(config.black){
			y = Math.max(
				y,
				blackPixel.data[i]
			);
		}
		pixelData[i+3 ] = y
	}


	if(config.hue){
		for (let i = 0; i < pixelData.length; i += 4) {
			let y = pixelData[i   ]
			y = y % config.hueGroup * (255/config.hueGroup) /255;
			const [r,g,b] =  hsl2rgb([y,.7,.5])
			pixelData[i+0 ] = r 
			pixelData[i+1 ] = g
			pixelData[i+2 ] = b
		}
	}

	// for(let i = 0;i < pixelData.length;i += 4){

	// 	let _rgb = yuv2rgb(
	// 		pixelData[i],
	// 		pixelData[i+1],
	// 		pixelData[i+2],
	// 	);

	// 	pixelData[i   ] = _rgb[0];
	// 	pixelData[i+1 ] = _rgb[1];
	// 	pixelData[i+2 ] = _rgb[2];
	// }

	// blurC();
	ctx.putImageData(pixel, 0, 0);

	const ctxMin = canvasMin.getContext('2d');

	canvasMin.width = Math.floor(_width/1.4);
	canvasMin.height = Math.floor(_height/1.3);

	ctxMin.clearRect(0,0,canvasMin.width,canvasMin.height)
	ctxMin.drawImage(
		canvas,
		0,0,
		canvasMin.width,canvasMin.height
	);
	
	ctx.clearRect(0,0,_width,_height)
	ctx.drawImage(
		canvasMin,
		0,0,
		canvasMin.width,canvasMin.height,
		0,0,_width,_height
	);

	console.timeEnd('louvre');
	// return canvas.toDataURL('image/png');
};



let convolute = (pixels, weights) => {
	const side = Math.round(Math.sqrt(weights.length));
	const halfSide = Math.floor(side / 2);

	const src = pixels.data;
	const sw = pixels.width;
	const sh = pixels.height;

	const w = sw;
	const h = sh;
	const output = ctx.createImageData(w, h);
	const dst = output.data;


	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const sy = y;
			const sx = x;
			const dstOff = (y * w + x) * 4;
			let r = 0, g = 0, b = 0;
			for (let cy = 0; cy < side; cy++) {
				for (let cx = 0; cx < side; cx++) {
					const scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
					const scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
					const srcOff = (scy * sw + scx) * 4;
					const wt = weights[cy * side + cx];
					r += src[srcOff] * wt;
					g += src[srcOff + 1] * wt;
					b += src[srcOff + 2] * wt;
				}
			}
			dst[dstOff] = r;
			dst[dstOff + 1] = g;
			dst[dstOff + 2] = b;
			dst[dstOff + 3] = 255;
		}
	}


	// for (let y=0; y<h; y++) {
	// 	for (let x=0; x<w; x++) {
	// 		const srcOff = (y*w+x)*4;
	// 		src[srcOff] = dst[srcOff];
	// 	}
	// }
	return output;
};




 const convoluteY = (pixels, weights) => {
	const side = Math.round( Math.sqrt( weights.length ) );
	const halfSide = Math.floor(side / 2);

	const src = pixels.data;

	const w = pixels.width;
	const h = pixels.height;
	const output = ctx.createImageData(w, h);
	const dst = output.data;

	for (let sy = 0; sy < h; sy++) {
		for (let sx = 0; sx < w; sx++) {
			const dstOff = (sy * w + sx) * 4;
			let r = 0, g = 0, b = 0;

			for (let cy = 0; cy < side; cy++) {
				for (let cx = 0; cx < side; cx++) {

					const scy = Math.min(h - 1, Math.max(0, sy + cy - halfSide));
					const scx = Math.min(w - 1, Math.max(0, sx + cx - halfSide));

					const srcOff = (scy * w + scx) * 4;
					const wt = weights[cy * side + cx];

					r += src[srcOff] * wt;
					// g += src[srcOff + 1] * wt;
					// b += src[srcOff + 2] * wt;
				}
			}
			dst[dstOff] = r;
			dst[dstOff + 1] = r;
			dst[dstOff + 2] = r;
			dst[dstOff + 3] = 255;
		}
	}


	// for (let y=0; y<h; y++) {
	// 	for (let x=0; x<w; x++) {
	// 		const srcOff = (y*w+x)*4;
	// 		src[srcOff] = dst[srcOff];
	// 	}
	// }
	return output;
};