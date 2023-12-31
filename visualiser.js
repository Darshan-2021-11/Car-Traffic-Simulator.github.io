/*
NOTE: 
1. This file needs to be saved with encoding(UTF-16 LE) to display neural network correctly with output arrows, otherwise output arrows might show wierd hex code.
2. To use unicode characters with javaScript, use "\u{4 digit hex code here...}" syntax.
3. We can use any javaScript graph library to do the same but this level of customisation is not possible in that.
*/
class Visualiser{
	static drawNetwork(ctx, network){
		const margin = 50;
		const left = margin;
		const top = margin;
		const width = ctx.canvas.width-margin*2;
		const height = ctx.canvas.height-margin*2;

		const levelHeight = height/network.levels.length;
		/*
		Why are we going from top(i=network.levels.length-1) to bottom(i>=0) in for loop?
		Because the biases drawn for previous level is being overwritten by the upper layers being drawn by context when we iterate for loop from bottom(i=0) to top(i<network.levels.length)
		*/
		for(let i=network.levels.length-1; i>=0; i--){
			const levelTop = top +
			lerp(
				height-levelHeight,
				0,
				network.levels.length == 1
				?.5:i/(network.levels.length-1)
				);

			ctx.setLineDash([7,3]);
			Visualiser.drawLevel(ctx, network.levels[i],
				left, levelTop, width, levelHeight,
				i==network.levels.length-1
				?/*
				These don't fill, this shows that the one that is shown transparent in the websites for arrows are actually filled with white cholour in the character themselves ["\u21E7","\u21E6","\u21E8","\u21E9"] oro ["\u21D1","\u21D0","\u21D2","\u21D3"]

				Instead use this
				["🡹","🡸","🡺","🡻"] i.e. source https://unicode-table.com/en/sets/arrow-symbols/#heavy-arrows
				*/
				["🡹","🡸","🡺","🡻"]:
				[]
				);
		}
	}

	static drawLevel(ctx, level, left, top, width, height, outputLabels){
		const right = left+width;
		const bottom = top+height;

		const {inputs, outputs, weights, biases} = level;

		const nodeRadius = 15;

		for(let i=0; i<inputs.length; i++){
			for(let j=0; j<outputs.length; j++){
				ctx.beginPath();
				ctx.moveTo(
					Visualiser.#getNodeX(inputs, i, left, right),
					bottom
				);
				ctx.lineTo(Visualiser.#getNodeX(outputs, j, left, right),
					top
					);
				ctx.lineWidth = 2;
				ctx.strokeStyle = getRGBA(weights[i][j]);
				ctx.stroke();
			}
		}

		for(let i=0; i<inputs.length; i++){
			const x= Visualiser.#getNodeX(inputs, i, left, right);
			ctx.beginPath();
			ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2);
			ctx.fillStyle = "black";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(x, bottom, nodeRadius*.6, 0, Math.PI*2);
			ctx.fillStyle = getRGBA(inputs[i]);
			ctx.fill();
		}

		for(let i=0; i<outputs.length; i++){
			const x = Visualiser.#getNodeX(outputs, i, left, right);
			ctx.beginPath();
			ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
			ctx.fillStyle = "black";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(x, top, nodeRadius*.6, 0, Math.PI*2);
			ctx.fillStyle = getRGBA(outputs[i]);
			ctx.fill();

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.arc(x, top, nodeRadius, 0, Math.PI*2);
			ctx.strokeStyle = getRGBA(biases[i]);
			ctx.setLineDash([3,3]);
			ctx.stroke();
			ctx.setLineDash([]);

			if(outputLabels[i]){
				ctx.beginPath();
				ctx.textAlign = "center";
				ctx.textBaseLine = "middle";
				ctx.fillStyle = "black";
				ctx.strokeStyle = "white";
				ctx.font = (nodeRadius*1.1)+"px Arial";
				/*
				`nodeRadius*.1` is added to top in fillText and fillStroke to corretly centre the arrows in the output layer of neuralNetwork.
				*/
				ctx.fillText(outputLabels[i],x,top+nodeRadius*.4);
				ctx.lineWidth = 1;
				ctx.strokeText(outputLabels[i],x,top+nodeRadius*.4);
			}
		}
	}

	static #getNodeX(nodes, index, left, right){
		return lerp(
			left,
			right,
			nodes.length==1
			?.5:
			index/(nodes.length-1)
			);
	}

}