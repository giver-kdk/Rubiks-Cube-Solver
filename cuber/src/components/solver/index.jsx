import "./style.css";
import React, { useState } from "react";
import { useEffect } from "react";
// import solver from "rubiks-cube-solver";

// import { Helmet } from "react-helmet";

function Solver(props) {
	// Cube Solving Logic
	// Here, "i" is the factor for amount of time needed(Says how long we should wait)
	let delay = 500,
		i = 0;
	let reverseIndex = 0,
		forwardIndex = 0;
	let solverStyle = "";
	let [orientation, setOrientation] = useState({
		front: 1,
		right: 4,
		upper: 2,
		down: 3,
		left: 5,
		back: 0,
	});
	let [stepCount, setStepCount] = useState(0);
	let [moveMessage, setMoveMessage] = useState(
		"Syncing the cube state with yours...🪄"
	);
	// let w = "u", g = "f", r = "r", o = "l", b = "b", y = "d";
	// let frontFace = [o, r, y, b, g, g, o, g, w].join("");
	// let rightFace = [r, y, w, y, r, w, r, o, w].join("");
	// let upperFace = [g, y, b, r, w, r, w, g, g].join("");
	// let downFace = [y, o, g, o, y, b, r, b, o].join("");
	// let leftFace = [y, b, b, r, o, w, y, w, b].join("");
	// let backFace = [r, o, o, g, b, w, g, y, b].join("");

	// let cubeState = [
	// frontFace,
	// rightFace,
	// upperFace,
	// downFace,
	// leftFace,
	// backFace
	// ].join('');

	// let solveMoves = solver(cubeState).split(" ");
	// console.log(solveMoves);
	useEffect(() => {
		// let scene = document.getElementById("scene");
		console.log("Script Ran");
		let movesNum = document.querySelector(".moves__num");
		let stepCountBtn = document.querySelector(".step__count");
		let repeatBtn = document.querySelector(".repeat__btn");
		let prevBtn = document.querySelector(".previous__btn");
		let nextBtn = document.querySelector(".next__move--btn");
		// var colors = ['blue', 'green', 'yellow', 'white', 'orange', 'red'],
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

		function getAxis(face) {
			return String.fromCharCode("X".charCodeAt(0) + face / 2); // X, Y or Z
		}

		// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
		function assembleCube() {
			function moveto(face) {
				id = id + (1 << face);

				// pieces[i].children[face].appendChild(document.createElement('div'))
				// 	.setAttribute('class', 'sticker ' + colors[face]);
				pieces[i].children[face]
					.appendChild(document.createElement("div"))
					.setAttribute("class", "sticker " + colors[face]);

				return (
					"translate" +
					getAxis(face) +
					"(" +
					((face % 2) * 4 - 2) +
					"em)"
				);
			}
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
				if (async) {
					// Use this for smooth animation
					requestAnimationFrame(rotatePieces);
				} else {
					// Use this for fast animation
					rotatePieces();
				}
			})();
		}

		// Events
		function mousedown(md_e) {
			// Side Rotation Logic
			var startXY = pivot.style.transform
					.match(/-?\d+\.?\d*/g)
					.map(Number),
				element = md_e.target.closest(".element"),
				face = [].indexOf.call(
					(element || cube).parentNode.children,
					element
				);
			function mousemove(mm_e) {
				if (element) {
					var gid = /\d/.exec(
						document.elementFromPoint(mm_e.pageX, mm_e.pageY).id
					);
					if (gid && gid.input.includes("anchor")) {
						mouseup();
						var e =
							element.parentNode.children[
								mx(face, Number(gid) + 3)
							].hasChildNodes();
						animateRotation(
							mx(face, Number(gid) + 1 + 2 * e),
							e,
							Date.now()
						);
						// console.log(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
					}
				}
				// Orientation change logic
				else
					pivot.style.transform =
						"rotateX(" +
						(startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +
						"deg)" +
						"rotateY(" +
						(startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +
						"deg)";
			}
			function mouseup() {
				document.body.appendChild(guide);
				// scene.removeEventListener("mousemove", mousemove);
				// document.removeEventListener("mouseup", mouseup);
				// scene.addEventListener("mousedown", mousedown);
			}

			(element || document.body).appendChild(guide);
			// scene.addEventListener("mousemove", mousemove);
			// document.addEventListener("mouseup", mouseup);
			// scene.removeEventListener("mousedown", mousedown);
		}

		// Single Side Rotation Logic Functions
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
		function turnX(clockwise) {
			if (clockwise) startX = startX + 90;
			else startX = startX - 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg) rotate3d(1,0,0,${startX}deg)`;
			setOrientation((prevOrientation) => {
				if (clockwise) {
					return {
						...prevOrientation,
						right: prevOrientation.upper,
						upper: prevOrientation.left,
						down: prevOrientation.right,
						left: prevOrientation.down,
					};
				} else {
					return {
						...prevOrientation,
						right: prevOrientation.down,
						upper: prevOrientation.right,
						down: prevOrientation.left,
						left: prevOrientation.upper,
					};
				}
			});
		}
		function turnY(clockwise) {
			if (clockwise) startXYZ[1] = startXYZ[1] - 90;
			else startXYZ[1] = startXYZ[1] + 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			setOrientation((prevOrientation) => {
				if (clockwise) {
					return {
						...prevOrientation,
						front: prevOrientation.right,
						right: prevOrientation.back,
						left: prevOrientation.front,
						back: prevOrientation.left,
					};
				} else {
					return {
						...prevOrientation,
						front: prevOrientation.left,
						right: prevOrientation.front,
						left: prevOrientation.back,
						back: prevOrientation.right,
					};
				}
			});
		}
		function turnZ(clockwise) {
			if (clockwise) startXYZ[2] = startXYZ[2] - 90;
			else startXYZ[2] = startXYZ[2] + 90;
			pivot.style.transform = `rotateX(${startXYZ[0]}deg) rotateY(${startXYZ[1]}deg) rotateZ(${startXYZ[2]}deg)`;
			setOrientation((prevOrientation) => {
				if (clockwise) {
					return {
						...prevOrientation,
						front: prevOrientation.down,
						upper: prevOrientation.front,
						down: prevOrientation.back,
						back: prevOrientation.upper,
					};
				} else {
					return {
						...prevOrientation,
						front: prevOrientation.upper,
						upper: prevOrientation.back,
						down: prevOrientation.front,
						back: prevOrientation.down,
					};
				}
			});
		}

		// Dual Layer Rotation Logic Functions
		function rotateFrontDual(clockwise, async) {
			if(async) i++;								// Buying(Reserving) More Time
			rotateBack(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnX(clockwise);
					i--;								// Freeing the reserved time
				}, delay);
			} else {
				turnX(clockwise);
			}
		}
		function rotateRightDual(clockwise, async) {
			if(async) i++;
			rotateLeft(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnZ(clockwise);
					i--;
				}, delay);
			} else {
				turnZ(clockwise);
			}
		}
		function rotateUpperDual(clockwise, async) {
			if(async) i++;
			rotateDown(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnY(clockwise);
					i--;
				}, delay);
			} else {
				turnY(clockwise);
			}
		}
		function rotateDownDual(clockwise, async) {
			if(async) i++;
			rotateUpper(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnY(!clockwise);
					i--;
				}, delay);
			} else {
				turnY(!clockwise);
			}
		}
		function rotateLeftDual(clockwise, async) {
			if(async) i++;
			rotateRight(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnZ(!clockwise);
					i--;
				}, delay);
			} else {
				turnZ(!clockwise);
			}
		}
		function rotateBackDual(clockwise, async) {
			if(async) i++;
			rotateFront(clockwise, async);
			if (async) {
				setTimeout(() => {
					turnX(!clockwise);
					i--;
				}, delay);
			} else {
				turnX(!clockwise);
			}
		}

		// Middle Layer Rotation Logic Functions
		function rotateM(clockwise, async) {
			if(async) i+=2;								// Buying(Reserving) Double Time for two Asynchronous Moves
			rotateRight(clockwise, async);
			if (async) {
				setTimeout(() => {
					rotateLeft(!clockwise, async);
					i--;								// Freeing 1st bought Time
					setTimeout(() => {
						turnZ(!clockwise);
						i--;							// Freeing 2nd bought Time
					}, delay);
				}, delay);
			} else {
				rotateLeft(!clockwise, async);
				turnZ(!clockwise);
			}
		}
		function rotateE(clockwise, async) {
			if(async) i+=2;
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
				turnY(!clockwise);
			}
		}
		function rotateS(clockwise, async) {
			if(async) i+=2;
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
				turnX(clockwise);
			}
		}

		// Solver Single Output to Cube Move Function
		function applyMove(move, async) {
			let rotation = move[0];
			let clockwise = move.includes("2")
				? true
				: move.includes("prime")
				? false
				: true;

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
			moveFunction();
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

		// Cube Scramble with Reverse Algorithm Execution
		function scramble_cube() {
			movesNum.classList.remove("active");
			stepCountBtn.classList.remove("active");
			prevBtn.setAttribute("disabled", "");
			repeatBtn.setAttribute("disabled", "");
			nextBtn.setAttribute("disabled", "");
			let async = false;
			setTimeout(() => {
				applyMove(props.movesAlgo.reverseAlgo[reverseIndex], async);
				if (reverseIndex < props.movesAlgo.reverseAlgo.length - 1) {
					reverseIndex++;
					scramble_cube();
				} else {
					movesNum.classList.add("active");
					nextBtn.removeAttribute("disabled");
					setMoveMessage(`Orient your cube as shown here to solve.`);
					return;
				}
				// let elem = getPieceBy(5, 4, 0);
				// elem.style.backgroundColor = "red";
				// console.log(elem);
			}, 10);
		}
		scramble_cube();
		function guide_moves() {
			let async = true;
			applyMove(props.movesAlgo.forwardAlgo[forwardIndex], async);
		}
		document.ondragstart = function () {
			return false;
		};
		// scene.addEventListener("mousedown", mousedown);
		assembleCube();
		// guide_moves();
		// rotateRight(true);
		function nextMove(repeat = false) {
			i++;										// Buying Time for Delay Execution
			movesNum.classList.remove("active");
			repeatBtn.removeAttribute("disabled");
			stepCountBtn.classList.add("active");
			console.log("Clicked Next Button");
			let async = true;
			// if(forwardIndex < props.movesAlgo.forwardAlgo.length)
			// {
			// 	// nextBtn.setAttribute('disabled', '');
			// 	setStepCount(prevCount => prevCount + 1);
			// 	setTimeout(() =>
			// 	{
			// 		applyMove(props.movesAlgo.forwardAlgo[forwardIndex], async);
			// 		forwardIndex++;
			// 		i--;
			// 	}, (delay * i));
			// }
			// else
			// {
			// 	console.log("Cube Solved...CONGRATULATIONS!!!");
			// }
			setTimeout(() => {
				if (forwardIndex < props.movesAlgo.forwardAlgo.length) {
					// nextBtn.setAttribute('disabled', '');
					if(!repeat) 
					{
						setStepCount((prevCount) => prevCount + 1);
					}
					applyMove(props.movesAlgo.forwardAlgo[forwardIndex], async);
					forwardIndex++;
					if(forwardIndex >= 2)
					{
						prevBtn.removeAttribute("disabled");
					}
					else
					{
						prevBtn.setAttribute("disabled", "");

					}
					i--;									// Freeing bought Time for next Move
				} else {
					console.log("Cube Solved...CONGRATULATIONS!!!");
				}
			}, delay * i);
		}
		function repeatMove()
		{
			let async = false, repeat = true;
			let reverseStepIndex = props.movesAlgo.reverseAlgo.length - (forwardIndex);
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			forwardIndex--;
			nextMove(repeat);
		}
		function previousMove()
		{
			let async = false, repeat = false;
			let reverseStepIndex = props.movesAlgo.reverseAlgo.length - (forwardIndex);
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			reverseStepIndex++;
			applyMove(props.movesAlgo.reverseAlgo[reverseStepIndex], async);
			forwardIndex -= 2;
			setStepCount((prevCount) => prevCount - 2);
			nextMove(repeat);
		}
		prevBtn.addEventListener("click", previousMove);
		nextBtn.addEventListener("click", (e) => nextMove(false));
		repeatBtn.addEventListener("click", repeatMove);
	}, []);


	return (
		<div className={`cube__container${solverStyle}`}>
			<div className="step__count flex__center--row">{`Step: ${stepCount}`}</div>
			<div className="move__name">{moveMessage}</div>
			<div className="moves__num">{`${props.movesAlgo.forwardAlgo.length} moves needed`}</div>
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
			{/* <Helmet>
        		<script src="../src/components/solver/script.js" />
      		</Helmet> */}
		</div>
	);
}

export default Solver;
