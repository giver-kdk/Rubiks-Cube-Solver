import { useState } from "react";
import "./App.css";
import React from "react";
import Start from "./components/start_page"
import FaceSet from "./components/face_set"
import Position from "./components/positioning";
import Solver from "./components/solver/";

function App() {
	let frontColor = ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'];
	let rightColor = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'];
	let upperColor = ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'];
	let downColor = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'];
	let leftColor = ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'];
	let backColor = ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'];
	let [pageVisibility, setPageVisibility] = useState([true, false, false, false, false]);
	// "faceColor" is an Object containing "Objects" inside it
	let [inputFaceColors, setInputFaceColor] = useState(
		{
			front: frontColor,
			right: rightColor,
			upper: upperColor,
			down: downColor,
			left: leftColor,
			back: backColor
		}
	);
	let [algoResult, setAlgoResult] = useState(
		{
			forwardAlgo: [],
			reverseAlgo: []
		}
	);
	function handleStart()
	{
		console.log("started");
		setPageVisibility([false, true, false, false, false]);
	}
	function handleFaceSet(e)
	{
		console.log("Face Set Ran");
		let name = e.target.name;
		let value = e.target.value;
		let finalValue = [];
		switch(name)
		{
			case "front":
				finalValue = frontColor;
				break;
			case "right":
				finalValue = rightColor;
				break;
			case "upper":
				finalValue = upperColor;
				break;
			case "down":
				finalValue = downColor;
				break;
			case "left":
				finalValue = leftColor;
				break;
			case "back":
				finalValue = backColor;
				break;
			default:
				console.log("Color Assignment Error");
		}
		finalValue = finalValue.map((color, index) =>
			{
				let finalColor = color;
				if(index < value.length)
				{
					switch(value[index])
					{
						case "g": 
							finalColor = "green";
							break;
						case "r": 
							finalColor = "red";
							break;
						case "w": 
							finalColor = "white";
							break;
						case "y": 
							finalColor = "yellow";
							break;
						case "o": 
							finalColor = "orange";
							break;
						case "b": 
							finalColor = "blue";
							break;
						default:
							console.log("Invalid Color. Default color will be used.");
	
					}
				}
				if(index == 4)
				{
					finalColor = color;
				}
				return finalColor;
			});
		// Use [] inside object if "key" is a variable
		setInputFaceColor(prevInputColor =>
			{
				return {
					...prevInputColor,
					[name]: finalValue
				}
			});
	}
	function handleFaceInput()
	{
		console.log("Face Input Ran");
		setPageVisibility([false, false, true, false, false]);
	}
	function handlePosition()
	{
		console.log("Position Ran");
		setPageVisibility([false, false, false, true, false]);
	}
	function handleSolver()
	{
		console.log("Solver Ran");
	}
	
	function handleAlgoResult(algo)
	{
		console.log("Algo Set Ran");
		let forward = algo.solveMoves;
		let reverse = algo.reverseMoves;
		setAlgoResult({forwardAlgo: forward, reverseAlgo: reverse});
	}
	// console.log(algoResult);
	return (
		<div className="App">
			<div className="app__container">
				{pageVisibility[0] && <Start handleClick={handleStart}/>}
				{pageVisibility[1] && <FaceSet handleClick={handleFaceInput} handleChange={handleFaceSet} colors={inputFaceColors}/>}
				{pageVisibility[2] && <Position handleClick={handlePosition} cubeColorState={inputFaceColors} setAlgo={(algo) => handleAlgoResult(algo)}/>}
				{pageVisibility[3] && <Solver handleClick={handleSolver} movesAlgo={algoResult}/>}
			</div>
		</div>
	);
}

export default App;
