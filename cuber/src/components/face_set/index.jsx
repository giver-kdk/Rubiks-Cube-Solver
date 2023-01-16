import React from 'react'
import Face from "./face"
import { useState } from 'react';
import solver from "rubiks-cube-solver";			
import "./style.css"

// Structure for face color input page
export default function FaceSet(props)
{
	let [movesNum, setMovesNum] = useState(0);
	// Solves cubes and generates output text(Steps to solve)
	function solveCube()
	{
		// Convert color into corresponding side 
			function color_to_side(colors) {
				let sideValue = colors.map((color) => {
					let result = "f";
					switch (color) {
						// "green" is in front face. So, its side is "f"
						case "green":
							result = "f";
							break;
						case "red":
							result = "r";					// "r" is right face
							break;
						case "white":
							result = "u";					// "u" is upper face
							break;
						case "yellow":
							result = "d";					// "d" is down face
							break;
						case "orange":
							result = "l";					// "l" is left face
							break;
						case "blue":
							result = "b";					// "b" is back face
							break;
						default:
							console.log(
								"Invalid Color to Side Conversion. Default side used"
							);
					}
					return result;
				});
				return sideValue;
			}
			// Collect the side names into separate variables
			let frontFace = color_to_side(props.cubeColorState.front).join("");
			let rightFace = color_to_side(props.cubeColorState.right).join("");
			let upperFace = color_to_side(props.cubeColorState.upper).join("");
			let downFace = color_to_side(props.cubeColorState.down).join("");
			let leftFace = color_to_side(props.cubeColorState.left).join("");
			let backFace = color_to_side(props.cubeColorState.back).join("");
			// Merge the collected side names into an array
			let cubeState = [
				frontFace,
				rightFace,
				upperFace,
				downFace,
				leftFace,
				backFace,
			].join("");
			// Side names are merged to make a proper input format for "solver" 
			// "solver" solves "cubeState" and generates output text as forward algorithm
			let solveMoves = solver(cubeState).split(" ");
			console.log(solveMoves);
			// Convert forward algorithm into reverse algorithm and store
			let reverseMoves = solveMoves.map((move) => {
				if(move.includes("2"))
					return move;
				else if(move.includes("prime"))
					return move.replace("prime", "");
				else
					return (move + "prime");
			}).reverse();
			// Now, algorithm is stored in "App.jsx" from here
			props.setAlgo({solveMoves, reverseMoves});
			// Set no. of moves needed
			setMovesNum(solveMoves.length);	
			// Take user to next page
			props.handleClick();
	}
	return (
		<div className="face__set--section flex__center--col">
			<div className="face__set--title">Type Face Color</div>
			<div className="face__set--body flex__center--row">
				<ul className="color__value--container">
					<div className="color__heading">Colors: </div>
					<li className="color__value green"><b>g</b> = Green</li>
					<li className="color__value red"><b>r</b> = Red</li>
					<li className="color__value white"><b>w</b> = White</li>
					<li className="color__value yellow"><b>y</b> = Yellow</li>
					<li className="color__value orange"><b>o</b> = Orange</li>
					<li className="color__value blue"><b>b</b> = Blue</li>
				</ul>
				<div className="face__set--container flex__center--row">
					<div className="face__info">
						<div className="face__name">Front Green Face</div>
							<Face side={props.colors.front} />
						<input name="front" type="text" className='color__input' placeholder='ggggggggg' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Right Red Face</div>
							<Face side={props.colors.right} />
						<input name="right" type="text" className='color__input' placeholder='rrrrrrrrr' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Upper White Face</div>
							<Face side={props.colors.upper} />
						<input name="upper" type="text" className='color__input' placeholder='wwwwwwwww' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Down Yellow Face</div>
							<Face side={props.colors.down} />
						<input name="down" type="text" className='color__input' placeholder='yyyyyyyyy' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Left Orange Face</div>
							<Face side={props.colors.left} />
						<input name="left" type="text" className='color__input' placeholder='ooooooooo' onChange={props.handleChange}/>
					</div>
					<div className="face__info">
						<div className="face__name">Back Blue Face</div>
							<Face side={props.colors.back} />
						<input name="back" type="text" className='color__input' placeholder='bbbbbbbbb' onChange={props.handleChange}/>
					</div>
				</div>
				<div className="example__colors">
					<div className="example__color--heading">Example:</div>
					<ul className="example__list">
						<li className="example__item green">ggyggwggg</li>
						<li className="example__item red">rrwbrrwrr</li>
						<li className="example__item white">wwowwgwwg</li>
						<li className="example__item yellow">yyryyyyyy</li>
						<li className="example__item orange">boooooooo</li>
						<li className="example__item blue">brrbbbbbb</li>
					</ul>
				</div>
			</div>
			<button className="color__set--btn" onClick={solveCube}>Next</button>
		</div>
	);
}