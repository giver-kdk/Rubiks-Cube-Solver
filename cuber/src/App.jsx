import { useState } from "react";
import "./App.css";
import React from "react";
import Start from "./components/start_page"
import FaceSet from "./components/face_set"
import Position from "./components/positioning";
import Solver from "./components/solver/";
import { useEffect } from "react";

function App() {
	// Define default color array for each cube face in a solved state
	let frontColor = ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'];
	let rightColor = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'];
	let upperColor = ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'];
	let downColor = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'];
	let leftColor = ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'];
	let backColor = ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'];
	// "inputFaceColors" object wraps-up above "color array" inside it
	let [inputFaceColors, setInputFaceColor] = useState({});
	// "algoResult" stores forward and backward algorithm outputs
	let [algoResult, setAlgoResult] = useState({});
	function resetCube()
	{
		setInputFaceColor(
			{
				front: frontColor,
				right: rightColor,
				upper: upperColor,
				down: downColor,
				left: leftColor,
				back: backColor
			}
		);
		setAlgoResult(
			{
				forwardAlgo: [],
				reverseAlgo: []
			}
		);
	}
	// Set Cube Parameters only once at first
	useEffect(() =>
	{
		resetCube();
	}, []);
	/* There are 5 pages in the app and only one page should be visible at once.
	So, "pageVisibility" array says which page to show at a time.
	Initially, only 1st page is "true" (Visible) */
	let [pageVisibility, setPageVisibility] = useState([true, false, false, false, false]);

	// Clicking to "Start" button of 1st page takes user to 2nd page
	function handleStart()
	{
		console.log("started");
		setPageVisibility([false, true, false, false, false]);
	}
	// Takes user to 3rd page
	function handlePosition()
	{
		console.log("Position Ran");
		setPageVisibility([false, false, true, false, false]);
	}
	// Takes user to 4th page
	function handleFaceInput()
	{
		console.log("Face Input Ran");
		setPageVisibility([false, false, false, true, false]);
	}
	// Set respective face color according to user input from keyboard
	function handleFaceSet(e)
	{
		console.log("Face Set Ran");
		let name = e.target.name;					// Get name of selected face(Total 6 faces)
		let value = e.target.value;					// Get string typed by user on input field
		let finalValue = [];
		// At first, store default color array for selected face
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
		// Now, modify above default color array according to input string
		finalValue = finalValue.map((color, index) =>
			{
				let finalColor = color;
				if(index < value.length)			// "value" contains input string
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
				// 4th index is center of a face whose color is always constant
				// It should always be set to default color, independent to user input
				if(index == 4)
				{
					finalColor = color;
				}
				return finalColor;
			});
			// Finally, assign modified color array on selected face
			setInputFaceColor(prevInputColor =>
				{
					return {
					...prevInputColor,
					// Use [] inside object if "key" is a variable
					[name]: finalValue
				}
			});
	}
	// Start of solver 
	function handleSolver()
	{
		console.log("Solver Ran");
	}
	function replayApp()
	{
		// Reset cube parameters
		resetCube();
		// Takes user to starting page
		setPageVisibility([true, false, false, false, false]);
		console.log("App Restarted");
	}
	// Update "algoResult" according to generated steps for solving cube
	function handleAlgoResult(algo)
	{
		console.log("Algo Set Ran");
		let forward = algo.solveMoves;
		let reverse = algo.reverseMoves;
		setAlgoResult({forwardAlgo: forward, reverseAlgo: reverse});
	}
	// console.log(algoResult.forwardAlgo);			
	return (
		<div className="App">
			<div className="app__container">
				{/* Conditional rendering of pages according to "pageVisibility" array */}
				{pageVisibility[0] && <Start handleClick={handleStart}/>}
				{pageVisibility[1] && <Position handleClick={handlePosition} />}
				{pageVisibility[2] && <FaceSet handleClick={handleFaceInput} handleChange={handleFaceSet} colors={inputFaceColors} setAlgo={(algo) => handleAlgoResult(algo)} cubeColorState={inputFaceColors}/>}
				{pageVisibility[3] && <Solver handleClick={handleSolver} movesAlgo={algoResult } handleReplay={replayApp}/> }
			</div>
		</div>
	);
}

export default App;
