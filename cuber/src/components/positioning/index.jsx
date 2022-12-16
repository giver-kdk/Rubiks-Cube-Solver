import React from "react";
import cube_pos from "./cube_position.png";
import solver from "rubiks-cube-solver";
import "./style.css";
import { useState } from "react";
import { useEffect } from "react";

export default function Position(props) {
	let [movesNum, setMovesNum] = useState(0);
	useEffect(() => {
		function color_to_side(colors) {
			let sideValue = colors.map((color) => {
				let result = "f";
				switch (color) {
					case "green":
						result = "f";
						break;
					case "red":
						result = "r";
						break;
					case "white":
						result = "u";
						break;
					case "yellow":
						result = "d";
						break;
					case "orange":
						result = "l";
						break;
					case "blue":
						result = "b";
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
		// let w = "u",
		// 	g = "f",
		// 	r = "r",
		// 	o = "l",
		// 	b = "b",
		// 	y = "d";
		let frontFace = color_to_side(props.cubeColorState.front).join("");
		let rightFace = color_to_side(props.cubeColorState.right).join("");
		let upperFace = color_to_side(props.cubeColorState.upper).join("");
		let downFace = color_to_side(props.cubeColorState.down).join("");
		let leftFace = color_to_side(props.cubeColorState.left).join("");
		let backFace = color_to_side(props.cubeColorState.back).join("");

		let cubeState = [
			frontFace,
			rightFace,
			upperFace,
			downFace,
			leftFace,
			backFace,
		].join("");

		let solveMoves = solver(cubeState).split(" ");
		console.log(solveMoves);
		let reverseMoves = solveMoves.map((move) => {
			if(move.includes("2"))
				return move;
			else if(move.includes("prime"))
				return move.replace("prime", "");
			else
				return (move + "prime");
		}).reverse();
		props.setAlgo({solveMoves, reverseMoves});
		setMovesNum(solveMoves.length);
	}, []);

	return (
		<div className="position__container flex__center--col">
			<div className="position__heading">
				Orient your cube as shown here.
			</div>
			<ul className="position__side--color flex__center--row">
				<li className="position__side">Green center at Front</li>
				<li className="position__side">White center at Top</li>
				<li className="position__side">Red center at Right</li>
			</ul>
			<div className="cube__pos--container">
				<img
					src={cube_pos}
					alt="Rubiks Cube Position Set"
					className="cube__pos--pic"
				/>
			</div>
			<div className="position__confirm">{`${movesNum} moves away. Are you ready?`}</div>
			<button className="pos__btn" onClick={props.handleClick}>
				Yes
			</button>
		</div>
	);
}
