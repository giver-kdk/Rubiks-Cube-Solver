import "./style.css";
import React, { useState } from "react";
import { useEffect } from "react";
import Confetti from "react-confetti"

// Reverses cube state to user's cube state and solves using step-wise animation
function Solver(props) {
	// Moving to next step while solving cube is asynchronous process
	// If user clicks "Next" at faster rate, some extra time is needed to animate previous steps
	// Here, "i" is the factor for amount of time to be reserved for the animation(waiting duration)
	let delay = 500,
		i = 0;
	let reverseIndex = 0,
		forwardIndex = 0;
	let solverStyle = "";
	let [cubeSolved, setCubeSolved] = useState(false);
	let [stepCount, setStepCount] = useState(0);
	let [moveMessage, setMoveMessage] = useState(
		"Syncing the cube state with yours...🪄"
	);
	// Orientaion is denoted by integers. If cube orientation changes, integer value is updated
	let orientation =
	{
		front: 1,
		right: 4,
		upper: 2,
		down: 3,
		left: 5,
		back: 0,
	};

	// Start reverse and forward algorithm animation after component is mounted
	useEffect(() => {
		console.log("Script Started");
		let cubePivot = document.querySelector("#pivot");
		let movesNum = document.querySelector(".moves__num");
		let stepCountBtn = document.querySelector(".step__count");
		let scrambleError = document.querySelector(".scramble__error");
		let retryBtn = document.querySelector(".retry__btn--scramble");
		let repeatBtn = document.querySelector(".repeat__btn");
		let prevBtn = document.querySelector(".previous__btn");
		let nextBtn = document.querySelector(".next__move--btn");
		let replayBtn = document.querySelector(".replay__btn");
		// Create color array by matching its index with "orientation" value
		var colors = ["blue", "green", "white", "yellow", "red", "orange"],
			pieces = document.getElementsByClassName("piece");

		// Returns j-th adjacent face of i-th face
		function mx(i, j) {
			return (
				([2, 4, 3, 5][j % 4 | 0] +
					(i % 2) * (((j | 0) % 4) * 2 + 3) +
					2 * ((i / 2) | 0)) %
				6
			);
		}
		// Get face axis for rotation: X, Y or Z
		function getAxis(face) {
			return String.fromCharCode("X".charCodeAt(0) + face / 2);
		}

		// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
		function assembleCube() {
			function moveto(face) {
				id = id + (1 << face);
				pieces[i].children[face]
					.appendChild(document.createElement("div"))
					.setAttribute("class", "sticker " + colors[face]);
				// Move repective pieces to their position
				return (
					"translate" +
					getAxis(face) +
					"(" +
					((face % 2) * 4 - 2) +
					"em)"
				);
			}
			// Orient respective pieces using rotation
			for (var id, x, i = 0; (id = 0), i < 26; i++) {
				x = mx(i, i % 18);
				pieces[i].style.transform =
					"rotateX(0deg)" +
					moveto(i % 6) +
					(i > 5
						? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "")
						: "");
				pieces[i].setAttribute("id", "piece" + id);
			}
		}
		// Access required piece of specified face of cube
		function getPieceBy(face, index, corner) {
			return document.getElementById(
				"piece" +
					((1 << face) +
						(1 << mx(face, index)) +
						(1 << mx(face, index + 1)) * corner)
			);
		}

		// Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
		function swapPieces(face, times) {
			for (var i = 0; i < 6 * times; i++) {
				var piece1 = getPieceBy(face, i / 2, i % 2),
					piece2 = getPieceBy(face, i / 2 + 1, i % 2);
				for (var j = 0; j < 5; j++) {
					var sticker1 =
							piece1.children[j < 4 ? mx(face, j) : face]
								.firstChild,
						sticker2 =
							piece2.children[j < 4 ? mx(face, j + 1) : face]
								.firstChild,
						className = sticker1 ? sticker1.className : "";
					if (className)
						(sticker1.className = sticker2.className),
							(sticker2.className = className);
				}
			}
		}

		// Animates rotation of the face (by clockwise if cw), and then swaps stickers
		function animateRotation(face, cw, currentTime, async = true) {
			var k = 0.3 * ((face % 2) * 2 - 1) * (2 * cw - 1),
				qubes = Array(9)
					.fill(pieces[face])
					.map(function (value, index) {
						return index
							? getPieceBy(face, index / 2, index % 2)
							: value;
					});
			if(async)
			{
				(function rotatePieces() {
					var passed = Date.now() - currentTime,
						style =
							"rotate" +
							getAxis(face) +
							"(" +
							k * passed * (passed < 300) +
							"deg)";
					qubes.forEach(function (piece) {
						piece.style.transform = piece.style.transform.replace(
							/rotate.\(\S+\)/,
							style
						);
					});
					if (passed >= 300) return swapPieces(face, 3 - 2 * cw);
					// Does smooth animation for forward algo
					requestAnimationFrame(rotatePieces);
				})();
			}
			else
			{
				(function rotatePieces() {
					var style =
							"rotate" +
							getAxis(face) +
							"(" +
							300
							"deg)";
					qubes.forEach(function (piece) {
						piece.style.transform = piece.style.transform.replace(
							/rotate.\(\S+\)/,
							style
						);
					});
					swapPieces(face, 3 - 2 * cw);
				})();
			}
		}
		// Events
		// function mousedown(md_e) {
		// 	// Side Rotation Logic
		// 	var startXY = pivot.style.transform
		// 			.match(/-?\d+\.?\d*/g)
		// 			.map(Number),
		// 		element = md_e.target.closest(".element"),
		// 		face = [].indexOf.call(
		// 			(element || cube).parentNode.children,
		// 			element
		// 		);
		// 	function mousemove(mm_e) {
		// 		if (element) {
		// 			var gid = /\d/.exec(
		// 				document.elementFromPoint(mm_e.pageX, mm_e.pageY).id
		// 			);
		// 			if (gid && gid.input.includes("anchor")) {
		// 				mouseup();
		// 				var e =
		// 					element.parentNode.children[
		// 						mx(face, Number(gid) + 3)
		// 					].hasChildNodes();
		// 				animateRotation(
		// 					mx(face, Number(gid) + 1 + 2 * e),
		// 					e,
		// 					Date.now()
		// 				);
		// 				// console.log(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
		// 			}
		// 		}
		// 		// Orientation change logic
		// 		else
		// 			pivot.style.transform =
		// 				"rotateX(" +
		// 				(startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +
		// 				"deg)" +
		// 				"rotateY(" +
		// 				(startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +
		// 				"deg)";
		// 	}
		// 	function mouseup() {
		// 		document.body.appendChild(guide);
		// 		// scene.removeEventListener("mousemove", mousemove);
		// 		// document.removeEventListener("mouseup", mouseup);
		// 		// scene.addEventListener("mousedown", mousedown);
		// 	}

		// 	(element || document.body).appendChild(guide);
		// 	// scene.addEventListener("mousemove", mousemove);
		// 	// document.addEventListener("mouseup", mouseup);
		// 	// scene.removeEventListener("mousedown", mousedown);
		// }

		// Single Side/Face Rotation Logic Functions
		function rotateFront(clockwise, async) {
			animateRotation(orientation.front, clockwise, Date.now(), async);
		}
		function rotateRight(clockwise, async) {
			animateRotation(orientation.right, clockwise, Date.now(), async);
		}
		function rotateUpper(clockwise, async) {
			animateRotation(orientation.upper, clockwise, Date.now(), async);
		}
		function rotateDown(clockwise, async) {
			animateRotation(orientation.down, clockwise, Date.now(), async);
		}
		function rotateLeft(clockwise, async) {
			animateRotation(orientation.left, clockwise, Date.now(), async);
		}
		function rotateBack(clockwise, async) {
			animateRotation(orientation.back, clockwise, Date.now(), async);
		}

		// Entire Cube Rotation Logic Functions
		var startXYZ = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number);
		let startX = 0;
		// Rotate entire cube about X-axis
		function turnX(clockwise, async = true) {
			// Perform rotation using CSS
			if (clockwise) startX = startX + 90;
			else startX = startX - 90;
			if(async)
			{
				pivot.style.transition = "all 0.5s ease-in-out";
			}
			else
			{
				pivot.style.transition = "all 0s ease-in-out";
			}
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg) rotate3d(1,0,0,${startX}deg)`;
			// Orientation is changed. So, update "orientation" value
			let prevOrientation = orientation;
			
			if (clockwise) {
			orientation =  {
					...prevOrientation,
					right: prevOrientation.upper,
					upper: prevOrientation.left,
					down: prevOrientation.right,
					left: prevOrientation.down,
				};
			} else {
			orientation = {
					...prevOrientation,
					right: prevOrientation.down,
					upper: prevOrientation.right,
					down: prevOrientation.left,
					left: prevOrientation.upper,
				};
			}
		}
		// Rotate entire cube about Y-axis
		function turnY(clockwise, async = true) {
			if (clockwise) startXYZ[1] = startXYZ[1] - 90;
			else startXYZ[1] = startXYZ[1] + 90;

			if(async)
			{
				pivot.style.transition = "all 0.5s ease-in-out";
			}
			else
			{
				pivot.style.transition = "all 0s ease-in-out";
			}
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			let prevOrientation = orientation;
			
			if (clockwise) {
			orientation =  {
					...prevOrientation,
					front: prevOrientation.right,
					right: prevOrientation.back,
					left: prevOrientation.front,
					back: prevOrientation.left,
				};
			} else {
			orientation = {
					...prevOrientation,
					front: prevOrientation.left,
					right: prevOrientation.front,
					left: prevOrientation.back,
					back: prevOrientation.right,
				};
			}
		}
		// Rotate entire cube about Z-axis
		function turnZ(clockwise, async = true) {
			if (clockwise) startXYZ[2] = startXYZ[2] - 90;
			else startXYZ[2] = startXYZ[2] + 90;
			if(async)
			{
				pivot.style.transition = "all 0.5s ease-in-out";
			}
			else
			{
				pivot.style.transition = "all 0s ease-in-out";
			}
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			let prevOrientation = orientation;
			
			if (clockwise) {
			orientation =  {
					...prevOrientation,
					front: prevOrientation.down,
					upper: prevOrientation.front,
					down: prevOrientation.back,
					back: prevOrientation.upper,
				};
			} else {
			orientation = {
					...prevOrientation,
					front: prevOrientation.upper,
					upper: prevOrientation.back,
					down: prevOrientation.front,
					back: prevOrientation.down,
				};
			}
		}
		/*
			Dual Layer Rotation Logic Functions:
				To simulate 2 front faces rotation at same time, perform negative rotation on back face.
				Then, positively rotate the entire cube 
		*/
		// Rotate 2 front faces
		function rotateFrontDual(clockwise, async) {
			if (async) i++; // Buying(Reserving) More Time
			rotateBack(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnX(clockwise);
					i--; // Freeing the reserved time
				}, delay);
			} else {
				turnX(clockwise, async);
			}
		}
		// Rotate 2 right faces
		function rotateRightDual(clockwise, async) {
			if (async) i++;
			rotateLeft(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnZ(clockwise);
					i--;
				}, delay);
			} else {
				turnZ(clockwise, async);
			}
		}
		// Rotate 2 upper faces
		function rotateUpperDual(clockwise, async) {
			if (async) i++;
			rotateDown(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnY(clockwise);
					i--;
				}, delay);
			} else {
				turnY(clockwise, async);
			}
		}
		// Rotate 2 down faces
		function rotateDownDual(clockwise, async) {
			if (async) i++;
			rotateUpper(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnY(!clockwise);
					i--;
				}, delay);
			} else {
				turnY(!clockwise, async);
			}
		}
		// Rotate 2 left faces
		function rotateLeftDual(clockwise, async) {
			if (async) i++;
			rotateRight(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnZ(!clockwise);
					i--;
				}, delay);
			} else {
				turnZ(!clockwise, async);
			}
		}
		// Rotate 2 back faces
		function rotateBackDual(clockwise, async) {
			if (async) i++;
			rotateFront(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnX(!clockwise);
					i--;
				}, delay);
			} else {
				turnX(!clockwise, async);
			}
		}

		/*
			Middle Layer Rotation Logic Functions:
				To simulate rotation of middle layer, perform negative rotations on 2 side faces.
				Then positively rotate the entire cube
		*/
		// Rotate Z-axis middle layer
		function rotateM(clockwise, async) {
			if (async) i += 2; // Buying(Reserving) Double Time for two Asynchronous Moves
			rotateRight(clockwise, async);
			if (async) {
				setTimeout(() => {
					rotateLeft(!clockwise, async);
					i--; // Freeing 1st bought Time
					setTimeout(() => {
						turnZ(!clockwise);
						i--; // Freeing 2nd bought Time
					}, delay);
				}, delay);
			} else {
				rotateLeft(!clockwise, async);
				turnZ(!clockwise, async);
			}
		}
		// Rotate Y-axis middle layer
		function rotateE(clockwise, async) {
			if (async) i += 2;
			rotateUpper(clockwise, async);
			if (async) {
				setTimeout(() => {
					rotateDown(!clockwise, async);
					i--;
					setTimeout(() => {
						turnY(!clockwise);
						i--;
					}, delay);
				}, delay);
			} else {
				rotateDown(!clockwise, async);
				turnY(!clockwise, async);
			}
		}
		// Rotate X-axis middle layer
		function rotateS(clockwise, async) {
			if (async) i += 2;
			rotateFront(!clockwise, async);
			if (async) {
				setTimeout(() => {
					rotateBack(clockwise, async);
					i--;
					setTimeout(() => {
						turnX(clockwise);
						i--;
					}, delay);
				}, delay);
			} else {
				rotateBack(clockwise, async);
				turnX(clockwise, async);
			}
		}
		// Convert algorithm's text output into actual animation
		// Map "solver" individual output with cube rotation functions

		// Low Level text to rotation
		function applyMove(move, async) {
			let rotation = move[0];
			// Detect direction of rotation
			let clockwise = move.includes("2")
				? true
				: move.includes("prime")
				? false
				: true;
			// Find corresponding rotation function
			let moveFunction = function findMove() {
				switch (rotation) {
					case "F":
						return rotateFront(clockwise, async);
					case "R":
						return rotateRight(clockwise, async);
					case "U":
						return rotateUpper(clockwise, async);
					case "D":
						return rotateDown(clockwise, async);
					case "L":
						return rotateLeft(clockwise, async);
					case "B":
						return rotateBack(clockwise, async);

					case "f":
						return rotateFrontDual(clockwise, async);
					case "r":
						return rotateRightDual(clockwise, async);
					case "u":
						return rotateUpperDual(clockwise, async);
					case "d":
						return rotateDownDual(clockwise, async);
					case "l":
						return rotateLeftDual(clockwise, async);
					case "b":
						return rotateBackDual(clockwise, async);

					case "M":
						return rotateM(clockwise, async);
					case "E":
						return rotateE(clockwise, async);
					case "S":
						return rotateS(clockwise, async);
					default:
						console.log("Move Function Conversion Error");
				}
			};
			moveFunction(); // Apply the rotation
			// Apply rotation again if move includes 2 rotations
			if (move.includes("2")) {
				if (async) {
					i++;
					setTimeout(() => {
						moveFunction();
						i--;
					}, delay);
				} else {
					moveFunction();
				}
			}
		}
		assembleCube();
		// Error Handling for Stack Size Limitation
		window.onerror = function (message, file, line, col, error) {
			if (
				error.name === "RangeError" &&
				error.message === "Maximum call stack size exceeded"
			) {
				console.log("Solver Message: Maximum call stack size exceeded");
				scrambleError.classList.add("active");
				retryBtn.classList.add("active");
			} else {
				throw error;
			}
		};
		// Cube Scramble with Reverse Algorithm Execution
		function scramble_cube() {
			movesNum.classList.remove("active");
			stepCountBtn.classList.remove("active");
			// Initially, "Previous", "Repeat" and "Next" are disabled
			prevBtn.setAttribute("disabled", "");
			repeatBtn.setAttribute("disabled", "");
			nextBtn.setAttribute("disabled", "");
			let async = false; // Scramble should not be smooth
			setTimeout(() =>
			{
				for(reverseIndex = 0; reverseIndex <= props.movesAlgo.reverseAlgo.length - 1; reverseIndex++)
				{
					applyMove(props.movesAlgo.reverseAlgo[reverseIndex], async);
				}
				movesNum.classList.add("active");
				nextBtn.removeAttribute("disabled");
				setMoveMessage(`Orient your cube as shown here to solve.`);

			}, 1000);
		}
		scramble_cube();
		function reScramble()
		{
			reverseIndex = 0;
			retryBtn.classList.remove("active");
			scrambleError.classList.remove("active");
			scramble_cube();
			assembleCube();
		}
		document.ondragstart = function () {
			return false;
		};
		// scene.addEventListener("mousedown", mousedown);
		// assembleCube();
		// Animates next move
		function nextMove(repeat = false) {
			i++; // Buying Time for animation
			movesNum.classList.remove("active"); // Hide total move no. count
			repeatBtn.removeAttribute("disabled"); // Allow user to repeat step
			stepCountBtn.classList.add("active"); // Count current step number
			console.log("Clicked Next Button");
			let async = true;
			setTimeout(() => {
				if (forwardIndex < props.movesAlgo.forwardAlgo.length) {
					// "nextMove()" is used by "repeatMove()" as well.
					if (!repeat) {
						// Increment step count if it's not a repeat case
						setStepCount((prevCount) => prevCount + 1);
					}
					// Perform next move animation
					applyMove(props.movesAlgo.forwardAlgo[forwardIndex], async);
					// Cube Solved Condition
					if(forwardIndex == props.movesAlgo.forwardAlgo.length - 1)
					{
						nextBtn.setAttribute("disabled", "");
						setCubeSolved(true);
						replayBtn.classList.add("active");
						// Rotate solved cube after 1 second
						setTimeout(() =>
						{
							cubePivot.classList.add("active");
							setMoveMessage(`CONGRATULATIONS!!! Cube is solved🎉`);
						}, 1500);
					}
					forwardIndex++;
					// Allow user to goto previous step if atleast 2 moves are done
					if (forwardIndex >= 2) {
						prevBtn.removeAttribute("disabled");
					} else {
						prevBtn.setAttribute("disabled", "");
					}
					i--; // Freeing bought Time for next Move
				} 
				else {
					console.log("Cube Already Solved...CONGRATULATIONS!!!");
				}
			}, delay * i);
		}
		// Repeats the recent move
		function repeatMove() {
			let async = false,
				repeat = true;
			// Reverse recent move
			let reverseStepIndex =
				props.movesAlgo.reverseAlgo.length - forwardIndex;
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			forwardIndex --;
			// Re-animate the move smoothly
			nextMove(repeat);
		}
		// Takes user to previous step
		function previousMove() {
			let async = false,
				repeat = false;
			// Next Button needs to be enabled
			nextBtn.removeAttribute("disabled");
			replayBtn.classList.remove("active");
			cubePivot.classList.remove("active");
			// Reverse 2 step moves
			let reverseStepIndex =
			props.movesAlgo.reverseAlgo.length - forwardIndex;
			console.log(forwardIndex, reverseStepIndex);
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			reverseStepIndex++;
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			forwardIndex -= 2;
			// Take the solved state to unsolved
			setCubeSolved(false);
			setMoveMessage(`Orient your cube as shown here to solve.`);
			setStepCount((prevCount) => prevCount - 2); // Decrement step count
			// Re-animate one move smoothly
			nextMove(repeat);
		}
		function handleKeys(e)
		{
			let inputKey = e.key;
			console.log(inputKey);
			if(inputKey == "ArrowLeft" && !prevBtn.hasAttribute("disabled"))
			{
				previousMove();
			}
			else if(inputKey == "ArrowDown" && !repeatBtn.hasAttribute("disabled"))
			{
				repeatMove();
			}
			else if(inputKey == "ArrowRight" && !nextBtn.hasAttribute("disabled"))
			{
				nextMove(false);
			}
		}
		retryBtn.addEventListener("click", reScramble);
		prevBtn.addEventListener("click", previousMove);
		nextBtn.addEventListener("click", (e) => nextMove(false));
		repeatBtn.addEventListener("click", repeatMove);
		replayBtn.addEventListener("click", (e) => props.handleReplay());
		window.addEventListener("keydown", handleKeys);
		return () =>
		{
			console.log("Solver Component Unmounted");
			
			forwardIndex = 0;
			reverseIndex = 0;
			retryBtn.classList.remove("active");
			scrambleError.classList.remove("active");
			replayBtn.classList.remove("active");
			cubePivot.classList.remove("active");

			prevBtn.setAttribute("disabled", "");
			repeatBtn.setAttribute("disabled", "");
			nextBtn.setAttribute("disabled", "");
			// setStepCount(0);
			// setCubeSolved(false);
			retryBtn.removeEventListener("click", reScramble);
			prevBtn.removeEventListener("click", previousMove);
			nextBtn.removeEventListener("click", (e) => nextMove(false));
			repeatBtn.removeEventListener("click", repeatMove);
			replayBtn.removeEventListener("click", (e) => props.handleReplay());
			window.removeEventListener("keydown", handleKeys);
		}
	}, []);

	// 3D Structure of cube with UI
	return (
		<div className={`cube__container${solverStyle}`}>
			<div className="step__count flex__center--row">{`Step: ${stepCount}`}</div>
			<div className="move__name">{moveMessage}</div>
			<div className="moves__num">{`${props.movesAlgo.forwardAlgo.length} moves needed`}</div>
			<div className="scramble__error">Memory consumption is high. Please try again!</div>
			<button className="retry__btn--scramble">Retry</button>
			{cubeSolved && <Confetti/>}
			<div className="scene" id="scene">
				<div
					className="pivot centered"
					id="pivot"
					style={{
						transform:
							"rotateX(-35deg) rotateY(-135deg) rotateZ(0deg)",
					}}
				>
					<div className="cube" id="cube">
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>

						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
						<div className="piece">
							<div className="element left"></div>
							<div className="element right"></div>
							<div className="element top"></div>
							<div className="element bottom"></div>
							<div className="element back"></div>
							<div className="element front"></div>
						</div>
					</div>
				</div>
			</div>
			<div id="guide">
				<div
					className="anchor"
					id="anchor3"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-270deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor2"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-180deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor1"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(-90deg) translateY(66.67%)",
					}}
				></div>
				<div
					className="anchor"
					id="anchor0"
					style={{
						transform:
							"translateZ(3px) translateY(-33.33%) rotate(0deg) translateY(66.67%)",
					}}
				></div>
			</div>
			<button className="previous__btn" disabled>
				Previous
			</button>
			<button className="repeat__btn" disabled>
				Repeat
			</button>
			<button className="next__move--btn" disabled>
				Next
			</button>
			<button className="replay__btn">
				Replay
			</button>
		</div>
	);
}

export default Solver;
