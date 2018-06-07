var canvas;
var ctx;
var items = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
var cellSize = 75;
var timeCounter = 1.0;
var PUZZLE_DIFFICULTY = 8;

var img = [[]];
var imgIndex = 0;

var random;

var x;
var y;
var j;
var i;
var k;
var l;

var mouse;
var piece = [];
var currentPiece = [];
var changePiece = [];

var imgObj;
var movingstep = 0;
var repeat;
var temp;

var delrow = false;
var delcol = false;
var outwhileloop = -1;
var cnt;
var repeatcnt = 0;

var eraseX = [];
var eraseY = [];

var buildX = [];
var buildY = [];
var buildGemTemp = [];
var deepestlocation = 0;

var upGemExist = true;
var movingdownrepeat;

var noDrawedX = [];
var noDrawedY = [];

var repeatDowardX = [];
var repeatDowardY = [];

var cntdroping0 = 0;
var cntdroping1 = 0;
var cntdroping2 = 0;
var cntdroping3 = 0;
var cntdroping4 = 0;
var cntdroping5 = 0;
var cntdroping6 = 0;
var cntdroping7 = 0;

var droppingstep0 = 0;
var droppingstep1 = 0;
var droppingstep2 = 0;
var droppingstep3 = 0;
var droppingstep4 = 0;
var droppingstep5 = 0;
var droppingstep6 = 0;
var droppingstep7 = 0;

var startdropping0 = 1;
var startdropping1 = 1;
var startdropping2 = 1;
var startdropping3 = 1;
var startdropping4 = 1;
var startdropping5 = 1;
var startdropping6 = 1;
var startdropping7 = 1;

var vhint = [];
var vhintcnt = 0;
var hhint = [];
var hhintcnt = 0;

var mousePos;
var clickcnt = 0;

var score = 0;
var moves = 0;

var minutesLabel;
var secondsLabel;
var totalSeconds = 240;

function init(){
	setCanvas();
	do{
		insertImage();
	}while(checkinghorizontal() == true || checkingvertical() == true);	
	eraseX = [];
	eraseY = [];
	setTimeout(repaintall, 100);
	startGame();
	timer = setInterval(setTime, 1000);
	
}

function setCanvas(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	cellSize = 75;
	ctx.beginPath();
	ctx.strokeStyle='black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();
}

function insertImage(){
	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			items[i][j] = new Image();
			items[i][j].src = "images/" + randomGem() + ".png";
			//alert(items[i][j].src);
			items[i][j].onload = (function(i, j){
				ctx.drawImage(items[i][j], i * 75, j * 75, 75, 75);
			})(i, j);
		}
	}	
}

function randomGem(){
	var random = Math.floor((Math.random() * 6) + 1);
		return random;
}

function startGame(){
	canvas.addEventListener('click', function(evt) {
		mousePos = null;
		mousePos = getMousePos(canvas, evt);
		//alert(mousePos.x + ", " + mousePos.y);
		if( clickcnt == 0){
			onPuzzleClick(mousePos.x, mousePos.y);
			clickcnt++;
			document.getElementById("moves").innerHTML = "Moves: " + moves;
		}else{
			onPuzzleChange(mousePos.x, mousePos.y);
			clickcnt = 0;
			moves++;
			document.getElementById("moves").innerHTML = "Moves: " + moves;
		}
	});
	
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
       	x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function onPuzzleClick(mouseX, mouseY){
	if(currentPiece.length != 0){
    	ctx.clearRect(0,0,canvas.width,canvas.height);
    	repaintall();
    }
    //document.onmousedown = onPuzzleChange;

	//alert(mouseX + ", " + mouseY);
	currentPiece = checkPieceClicked(mouseX, mouseY);
	piece = [];
	//alert(mouseX + ", " + mouseY + ", " + currentPiece[0].src + ", " + currentPiece[1] + ", " + currentPiece[2]);
	if(currentPiece.length != 0){
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
      	ctx.strokeRect(currentPiece[1]*cellSize, currentPiece[2]*cellSize, cellSize, cellSize);
      	ctx.restore();
      	ctx.closePath();
	}
}

function onPuzzleChange(mouseX, mouseY){
	
	changePiece = checkPieceClicked(mouseX, mouseY);
	piece = [];

	//alert(mouse.x + ", " + mouse.y + ", " + changePiece[0].src + ", " + changePiece[1] + ", " + changePiece[2]);

	if(changePiece.length != 0 && changePiece[1] - 1 == currentPiece[1] & changePiece[2] == currentPiece[2]){
		//alert(currentPiece[1] + ", " + currentPiece[2]);
		repeatcnt = 1;
		repeat = setInterval("moveRight(currentPiece[1], currentPiece[2])", 5);
		repaintall();
	}else if (changePiece.length != 0 && changePiece[1] + 1 == currentPiece[1] & changePiece[2] == currentPiece[2]){
		repeatcnt = 1;
		repeat = setInterval("moveLeft(currentPiece[1], currentPiece[2])", 5);
      	repaintall();
  	}else if(changePiece.length != 0 && changePiece[1] == currentPiece[1] & changePiece[2] + 1 == currentPiece[2]){
  		repeatcnt = 1;
  		repeat = setInterval("moveUp(currentPiece[1], currentPiece[2])", 5);
      	repaintall();
  	}else if(changePiece.length != 0 && changePiece[1] == currentPiece[1] & changePiece[2] - 1 == currentPiece[2]){
  		repeatcnt = 1;
  		repeat = setInterval("moveDown(currentPiece[1], currentPiece[2])", 5);
      	repaintall();
	}
}

function checkPieceClicked(x, y){
	for( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if(x < i * cellSize || x > (i * cellSize + cellSize) || y < j * cellSize || y > (j * cellSize + cellSize)){
			//PIECE NOT HIT 
			}else{
				piece.push(items[i][j]);
				piece.push(i);
				piece.push(j);
				return piece;
			} 
		}
	}
	return null; 
}


function repaintall(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			items[i][j].onload = (function(i, j){
				ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
			})(i, j);
		}
	}	
}


function moveRight(x, y){
	movingstep = movingstep + 5;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( x == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize + movingstep, j * cellSize, cellSize, cellSize);
				})(i, j);
			}else if(x+1 == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize - movingstep, j * cellSize, cellSize, cellSize);
				})(i, j);
			}else{
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
				})(i, j);
			}
		}

	}

	//alert(movingstep);

	if(movingstep == cellSize){
		temp = items[x][y].src;
		items[x][y].src = items[x+1][y].src;
		items[x+1][y].src = temp;
		temp = "";
		movingstep = 0;
      	clearInterval(repeat);
      	if(checkinghorizontal() == false & checkingvertical() == false & repeatcnt == 1){
      		repeat = setInterval("moveLeft(changePiece[1], changePiece[2])", 5);
      		repeatcnt = 0;
      	}else{
      		for( i = 0; i < eraseX.length; i++){
				erasegem(eraseX[i], eraseY[i]);
				score += 100;
			}
			eraseX = [];
			eraseY = [];
      	}
		saveClearLocation();
    }
}

function moveLeft(x, y){
	movingstep = movingstep + 5;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( x == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize - movingstep, j * cellSize, cellSize, cellSize);
				})(i, j);
			}else if(x-1 == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize + movingstep, j * cellSize, cellSize, cellSize);
				})(i, j);
			}else{
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
				})(i, j);
			}
		}

	}

	if(movingstep == cellSize){
		temp = items[x][y].src;
		items[x][y].src = items[x-1][y].src;
		items[x-1][y].src = temp;
		temp = "";
		//alert(items[x][y].src + ", " + items[x-1][y].src);
		movingstep = 0;
      	clearInterval(repeat);
      	if(checkinghorizontal() == false & checkingvertical() == false & repeatcnt == 1){
      		repeat = setInterval("moveRight(changePiece[1], changePiece[2])", 5);
      		repeatcnt = 0;
      	}else{
      		for( i = 0; i < eraseX.length; i++){
				erasegem(eraseX[i], eraseY[i]);
				score += 100;
			}
			eraseX = [];
			eraseY = [];
      	}
      	saveClearLocation();
    }
}

function moveUp(x, y){
	movingstep = movingstep + 5;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( x == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize - movingstep, cellSize, cellSize);
				})(i, j);
			}else if(x == i && y-1 == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize + movingstep, cellSize, cellSize);
				})(i, j);
			}else{
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
				})(i, j);
			}
		}

	}

	if(movingstep == cellSize){
		temp = items[x][y].src;
		items[x][y].src = items[x][y-1].src;
		items[x][y-1].src = temp;
		temp = "";
		movingstep = 0;
      	clearInterval(repeat);
      	if(checkinghorizontal() == false & checkingvertical() == false & repeatcnt == 1){
      		repeat = setInterval("moveDown(changePiece[1], changePiece[2])", 5);
      		repeatcnt = 0;
      	}else{
      		for( i = 0; i < eraseX.length; i++){
				erasegem(eraseX[i], eraseY[i]);
				score += 100;
			}
			eraseX = [];
			eraseY = [];
      	}
      	saveClearLocation();
    }
}

function moveDown(x, y){
	movingstep = movingstep + 5;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( x == i && y == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize + movingstep, cellSize, cellSize);
				})(i, j);
			}else if(x == i && y+1 == j){
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize - movingstep, cellSize, cellSize);
				})(i, j);
			}else{
				items[i][j].onload = (function(i, j){
					ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
				})(i, j);
			}
		}
	}

	if(movingstep == cellSize){
		temp = items[x][y].src;
		items[x][y].src = items[x][y+1].src;
		items[x][y+1].src = temp;
		temp = "";
		movingstep = 0;
		//item[0][0].src = null;
      	clearInterval(repeat);
      	if(checkinghorizontal() == false & checkingvertical() == false & repeatcnt == 1){
      		repeat = setInterval("moveUp(changePiece[1], changePiece[2])", 5);
      		repeatcnt = 0;
      	}else{
      		for( i = 0; i < eraseX.length; i++){
				erasegem(eraseX[i], eraseY[i]);
				score += 100;
			}
			eraseX = [];
			eraseY = [];
      	}
      	saveClearLocation();
    }
}

function checkinghorizontal(){
	delrow = false;   
	for ( k = 0; k < PUZZLE_DIFFICULTY; k++){
		for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
			cnt = 0;
			j = i;
			while(items[i][k].src == items[j][k].src && outwhileloop == -1){
				if( j < PUZZLE_DIFFICULTY-1)
					j++;
				else
					outwhileloop = 1;
				cnt++;
			}
			outwhileloop = -1;                          
                    
			if( cnt > 2){
				delrow = true;
				for( x = 0; x < cnt; x++){
					eraseX.push(i);
					eraseY.push(k);
					i++;         
				}
			}
		}
	}     
	return delrow;
}

function checkingvertical(){
	delcol = false;   
	for ( k = 0; k < PUZZLE_DIFFICULTY; k++){
		for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
			cnt = 0;
			j = i;
			while(items[k][i].src == items[k][j].src && outwhileloop == -1){
				if( j < PUZZLE_DIFFICULTY-1)
					j++;
				else
					outwhileloop = 1;
					cnt++;
			}
			outwhileloop = -1;                          
                    
			if( cnt > 2){
				delcol = true;
				for( x = 0; x < cnt; x++){
					eraseX.push(k);
					eraseY.push(i);
					i++;         
				}
			}
		}
	}     
	return delcol;
}

function erasegem(x,y){
	items[x][y].src = "images/clear.png";
}


function saveClearLocation(){
	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( items[i][j].src.search("images/clear.png") > 0 ){
				//alert(items[i][j].src + ", " + i + ", " + j);
				buildX.push(i);
				buildY.push(j);
			}
		}
	}
	
	for( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = 0; j < PUZZLE_DIFFICULTY; j++){
			if( checkUpGemExist(i, j) == false){
				this.noDrawedX.push(i);
				this.noDrawedY.push(j);
			}
		}
	}

	if(buildX.length > 0){
		downwardAnimation();
	}
}

function checkUpGemExist(checkUpGemX, checkUpGemY){
	upGemExist = true;
	for ( l = 0; l < PUZZLE_DIFFICULTY; l++){
		for( k = 0; k < buildX.length; k++){
			if( buildX[k] == checkUpGemX && buildY[k] - l == checkUpGemY ){
				upGemExist = false;
			}
		}
	}
	return upGemExist;
}


function checkUpGemExist2(checkUpGemX, checkUpGemY){
	upGemExist = true;
	for( k = 0; k < repeatDowardX.length; k++){
		if( repeatDowardX[k] == checkUpGemX && repeatDowardY[k] == checkUpGemY ){
			upGemExist = false;
		}
	}
	return upGemExist;
}


function searchfordropping(){
	for( i = 0; i < buildX.length; i++){
		if( buildX[i] == 0){
			cntdroping0++;
		}else if (buildX[i] == 1){
			cntdroping1++;
		}else if (buildX[i] == 2){
			cntdroping2++;
		}else if (buildX[i] == 3){
			cntdroping3++;
		}else if (buildX[i] == 4){
			cntdroping4++;
		}else if (buildX[i] == 5){
			cntdroping5++;
		}else if (buildX[i] == 6){
			cntdroping6++;
		}else if (buildX[i] == 7){
			cntdroping7++;
		}
	}
	//alert(cntdroping0 + ", " + cntdroping1 + ", " + cntdroping2 + ", " + cntdroping3 + ", " + cntdroping4 + ", " + cntdroping5 );
}

function downwardAnimation(){
	//alert(noDrawedX[0] + ", " + buildY[0]);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	for( i = cellSize; i < canvas.width; i += cellSize){
		ctx.moveTo(i,0);
		ctx.lineTo(i,600);
		ctx.moveTo(0,i);
		ctx.lineTo(600,i);
	}
	ctx.stroke();
	ctx.closePath();

	//insertGem();
	
	for( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = 0; j < PUZZLE_DIFFICULTY; j++){
			items[i][j].onload = (function(i, j){
				ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
			})(i, j);
			
		}
	}
	//alert(movingstep);

	//alert(buildGemTemp.length);
	//alert(noDrawedX[0] + ", " + noDrawedY[0]);

	for ( i = 0; i < noDrawedX.length; i++){
		repeatDowardX.push(noDrawedX[i]);
		repeatDowardY.push(noDrawedY[i]);
		//alert(repeatDowardX[i] + ", " + repeatDowardY[i]);
	}

	searchfordropping();
	buildGem();

	repeat = setInterval(function(){ 
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		for( i = cellSize; i < canvas.width; i += cellSize){
			ctx.moveTo(i,0);
			ctx.lineTo(i,600);
			ctx.moveTo(0,i);
			ctx.lineTo(600,i);
		}
		ctx.stroke();
		ctx.closePath();

		//insertGem();
		
		for( i = 0; i < PUZZLE_DIFFICULTY; i++){
			for( j = 0; j < PUZZLE_DIFFICULTY; j++){
				if(checkUpGemExist2(i, j) == true){
					items[i][j].onload = (function(i, j){
						ctx.drawImage(items[i][j], i * cellSize, j * cellSize, cellSize, cellSize);
					})(i, j);
				}
			}
		}
		//alert(buildX[0]);
		movingstep = movingstep + 5;
		if( droppingstep0 < cntdroping0 * cellSize )
			droppingstep0 = droppingstep0 + 5;
		if( droppingstep1 < cntdroping1 * cellSize )
			droppingstep1 = droppingstep1 + 5;
		if( droppingstep2 < cntdroping2 * cellSize )
			droppingstep2 = droppingstep2 + 5;
		if( droppingstep3 < cntdroping3 * cellSize )
			droppingstep3 = droppingstep3 + 5;
		if( droppingstep4 < cntdroping4 * cellSize )
			droppingstep4 = droppingstep4 + 5;
		if( droppingstep5 < cntdroping5 * cellSize )
			droppingstep5 = droppingstep5 + 5;
		if( droppingstep6 < cntdroping6 * cellSize )
			droppingstep6 = droppingstep6 + 5;
		if( droppingstep7 < cntdroping7 * cellSize )
			droppingstep7 = droppingstep7 + 5;

		//dropping on normal gems
		for ( i = 0; i < repeatDowardX.length; i++){ 
		//alert(noDrawedX[i] + ", " + noDrawedY[i]);
			if( repeatDowardX[i] == 0){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep0, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 1){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep1, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 2){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep2, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 3){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep3, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 4){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep4, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 5){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep5, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 6){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep6, cellSize, cellSize);
				})(i);
			}else if ( repeatDowardX[i] == 7){
				items[repeatDowardX[i]][repeatDowardY[i]].onload = (function(i){
					ctx.drawImage(items[repeatDowardX[i]][repeatDowardY[i]], repeatDowardX[i] * cellSize, repeatDowardY[i] * cellSize + droppingstep7, cellSize, cellSize);
				})(i);
			}
		}


		//dropping on created gems
		for ( i = 0; i < buildGemTemp.length; i++){
			//alert(cnt);
			if( buildX[i] == 0){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep0, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping0 ++;
			}else if ( buildX[i] == 1 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep1, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping1 ++;
			}else if ( buildX[i] == 2 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep2, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping2 ++;
			}else if ( buildX[i] == 3 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep3, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping3 ++;
			}else if ( buildX[i] == 4 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep4, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping4 ++;
			}else if ( buildX[i] == 5 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep5, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping5 ++;
			}else if ( buildX[i] == 6 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep6, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping6 ++;
			}else if ( buildX[i] == 7 ){
				buildGemTemp[i][0].onload = (function(i){
					ctx.drawImage(buildGemTemp[i][0], buildX[i] * cellSize, buildGemTemp[i][1] * -cellSize + droppingstep7, cellSize, cellSize);
				})(i);
				if(cnt == 0)
					startdropping7 ++;
			}
		}
		
		if(movingstep == findBiggest()*75){
			clearInterval(repeat);
			
			insertGem();
					
			movingstep = 0;
			repeatDowardX = [];
    		repeatDowardY = [];
    		buildX = [];
			buildY = [];
			noDrawedX = [];
			noDrawedY = [];
			buildGemTemp = [];
			
			cntdroping0 = 0;
			cntdroping1 = 0;
			cntdroping2 = 0;
			cntdroping3 = 0;
			cntdroping4 = 0;
			cntdroping5 = 0;
			cntdroping6 = 0;
			cntdroping7 = 0;
			
			droppingstep0 = 0;
			droppingstep1 = 0;
			droppingstep2 = 0;
			droppingstep3 = 0;
			droppingstep4 = 0;
			droppingstep5 = 0;
			droppingstep6 = 0;
			droppingstep7 = 0;

			if(checkinghorizontal() == true || checkingvertical() == true){
				for( i = 0; i < eraseX.length; i++){
					erasegem(eraseX[i], eraseY[i]);
					score += 100;
				}
				eraseX = [];
				eraseY = [];
				saveClearLocation();
			}else{

				//check any gem can be erased
				if( checkhorizontalhint().length == 0 && checkverticalhint().length == 0){
					do{
						insertImage();
					}while(checkinghorizontal() == true || checkingvertical() == true);	
					eraseX = [];
					eraseY = [];
					repaintall();
					clickcnt = 0;
				}
			}
			//repaintall();
			//document.score.text(score);
			document.getElementById("score").innerHTML = "Score: " + score + " / 20000";
			document.getElementById("moves").innerHTML = "Moves: " + moves;

		}
	}, 5);
}

function buildGem(){
	startdropping0 = 1;
	startdropping1 = 1;
	startdropping2 = 1;
	startdropping3 = 1;
	startdropping4 = 1;
	startdropping5 = 1;
	startdropping6 = 1;
	startdropping7 = 1;
	for ( i = 0; i < buildX.length; i++){
		buildGemTemp[i] = [];
		buildGemTemp[i][0] = new Image();
		buildGemTemp[i][0].src = "images/" + randomGem() + ".png";
		
		if(buildX[i] == 0){
			buildGemTemp[i][1] = startdropping0;
			startdropping0++;
		}else if (buildX[i] == 1){
			buildGemTemp[i][1] = startdropping1;
			startdropping1++;
		}else if (buildX[i] == 2){
			buildGemTemp[i][1] = startdropping2;
			startdropping2++;
		}else if (buildX[i] == 3){
			buildGemTemp[i][1] = startdropping3;
			startdropping3++;
		}else if (buildX[i] == 4){
			buildGemTemp[i][1] = startdropping4;
			startdropping4++;
		}else if (buildX[i] == 5){
			buildGemTemp[i][1] = startdropping5;
			startdropping5++;
		}else if (buildX[i] == 6){
			buildGemTemp[i][1] = startdropping6;
			startdropping6++;
		}else if (buildX[i] == 7){
			buildGemTemp[i][1] = startdropping7;
			startdropping7++;
		}
	}
}

function insertGem(){
	var tempDown;
	
	for( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = PUZZLE_DIFFICULTY - 1; j >= 0; j--){
			if(items[i][j].src.search("images/clear.png") > 0){
				for(k = 0; k < j; k++){
					if(items[i][k].src.search("images/clear.png") < 0){
						tempDown = items[i][j].src;
						items[i][j].src = items[i][k].src;
						items[i][k].src = tempDown;
					}
				}
			}
		}
	}

	tempDown = "";

	buildX = [];
	buildY = [];

	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for ( j = PUZZLE_DIFFICULTY - 1; j >= 0; j--){
			if( items[i][j].src.search("images/clear.png") > 0 ){
				//alert(items[i][j].src + ", " + i + ", " + j);
				buildX.push(i);
				buildY.push(j);
			}
		}
	}

	for ( i = 0; i < buildGemTemp.length; i++){
		items[buildX[i]][buildY[i]].src = buildGemTemp[i][0].src;
	}
}

function findBiggest(){
	var biggest = 0;
	if(biggest < cntdroping0)
		biggest = cntdroping0;
	if(biggest < cntdroping1)
		biggest = cntdroping1;
	if(biggest < cntdroping2)
		biggest = cntdroping2;
	if(biggest < cntdroping3)
		biggest = cntdroping3;
	if(biggest < cntdroping4)
		biggest = cntdroping4;
	if(biggest < cntdroping5)
		biggest = cntdroping5;
	if(biggest < cntdroping6)
		biggest = cntdroping6;
	if(biggest < cntdroping7)
		biggest = cntdroping7;
	return biggest;
}

function checkverticalhint(){
	vhint = [];
	vhintcnt = 0;

	//check down only
	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = 0; j < PUZZLE_DIFFICULTY; j++){
			//check two continuous same
			if( j+1 < PUZZLE_DIFFICULTY && items[i][j].src == items[i][j+1].src){

				//alert(i + "," + j + " AND " + i + ", " + j+1);

				//check down
				if( j+3 < PUZZLE_DIFFICULTY){
					if(items[i][j].src == items[i][j+3].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i;
						vhint[vhintcnt][1] = j+3;
						vhint[vhintcnt][2] = "downdown";
						vhintcnt++;
					}
				}

				//check down right
				if( i+1 < PUZZLE_DIFFICULTY && j+2 < PUZZLE_DIFFICULTY){
					if(items[i][j].src == items[i+1][j+2].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i+1;
						vhint[vhintcnt][1] = j+2;
						vhint[vhintcnt][2] = "downright";
						vhintcnt++;
					}
				}

				//check down left
				if( i-1 >= 0 && j+2 < PUZZLE_DIFFICULTY){
					if(items[i][j].src == items[i-1][j+2].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i-1;
						vhint[vhintcnt][1] = j+2;
						vhint[vhintcnt][2] = "downleft";
						vhintcnt++;
					}
				}

				//check up 
				if( j-2 >= 0){
					if(items[i][j].src == items[i][j-2].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i;
						vhint[vhintcnt][1] = j-2;
						vhint[vhintcnt][2] = "upup";
						vhintcnt++;
					}
				}

				//check up right
				if( i+1 < PUZZLE_DIFFICULTY && j-1 >= 0){
					if(items[i][j].src == items[i+1][j-1].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i+1;
						vhint[vhintcnt][1] = j-1;
						vhint[vhintcnt][2] = "upright";
						vhintcnt++;
					}
				}

				//check up left
				if( i-1 >= 0 && j-1 >= 0){
					if(items[i][j].src == items[i-1][j-1].src){
						vhint[vhintcnt] = [];
						vhint[vhintcnt][0] = i-1;
						vhint[vhintcnt][1] = j-1;
						vhint[vhintcnt][2] = "upleft";
						vhintcnt++;
					}
				}
			}
			
			//check middle is missing
			if( j+2 < PUZZLE_DIFFICULTY){
				if(items[i][j].src == items[i][j+2].src){

					//check right
					if( i+1 < PUZZLE_DIFFICULTY && j+1 < PUZZLE_DIFFICULTY){
						if(items[i][j].src == items[i+1][j+1].src){
							vhint[vhintcnt] = [];
							vhint[vhintcnt][0] = i+1;
							vhint[vhintcnt][1] = j+1;
							vhint[vhintcnt][2] = "middleright";
							vhintcnt++;
						}
					}

					//check left
					if( i-1 >= 0 && j+1 < PUZZLE_DIFFICULTY){
						if(items[i][j].src == items[i-1][j+1].src){
							vhint[vhintcnt] = [];
							vhint[vhintcnt][0] = i-1;
							vhint[vhintcnt][1] = j+1;
							vhint[vhintcnt][2] = "middleleft";
							vhintcnt++;
						}
					}
				}
			}
		}
	}
	return vhint;
}

function checkhorizontalhint(){
	hhint = [];
	hhintcnt = 0;

	//check right only
	for ( i = 0; i < PUZZLE_DIFFICULTY; i++){
		for( j = 0; j < PUZZLE_DIFFICULTY; j++){

			//check two continuous same
			if( i+1 < PUZZLE_DIFFICULTY){
				if( items[i][j].src == items[i+1][j].src){

					//check right
					if( i+3 < PUZZLE_DIFFICULTY){
						if(items[i][j].src == items[i+3][j].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i+3;
							hhint[hhintcnt][1] = j;
							hhint[hhintcnt][2] = "rightright";
							hhintcnt++;
						}
					}

					//check right up
					if( i+2 < PUZZLE_DIFFICULTY && j-1 >=0){
						if(items[i][j].src == items[i+2][j-1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i+2;
							hhint[hhintcnt][1] = j-1;
							hhint[hhintcnt][2] = "rightup";
							hhintcnt++;
						}
					}

					//check right down
					if( i+2 < PUZZLE_DIFFICULTY && j+1 < PUZZLE_DIFFICULTY){
						if(items[i][j].src == items[i+2][j+1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i+2;
							hhint[hhintcnt][1] = j+1;
							hhint[hhintcnt][2] = "rightdown";
							hhintcnt++;
						}
					}

					//check left
					if( i-2 >= 0){
						if(items[i][j].src == items[i-2][j].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i-2;
							hhint[hhintcnt][1] = j;
							hhint[hhintcnt][2] = "leftleft";
							hhintcnt++;
						}
					}

					//check left up
					if( i-1 >= 0 && j-1 >= 0){
						if(items[i][j].src == items[i-1][j-1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i-1;
							hhint[hhintcnt][1] = j-1;
							hhint[hhintcnt][2] = "leftup";
							hhintcnt++;
						}
					}

					//check left down
					if( i-1 >= 0 && j+1 < PUZZLE_DIFFICULTY){
						if(items[i][j].src == items[i-1][j+1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i-1;
							hhint[hhintcnt][1] = j+1;
							hhint[hhintcnt][2] = "leftdown";
							hhintcnt++;
						}
					}
				}
			}

			//check middle is missing
			if( i+2 < PUZZLE_DIFFICULTY ){
				if( items[i][j].src == items[i+2][j].src){

					//check up
					if( i+1 < PUZZLE_DIFFICULTY && j-1 >= 0){
						if( items[i][j].src == items[i+1][j-1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i+1;
							hhint[hhintcnt][1] = j-1;
							hhint[hhintcnt][2] = "middleup";
							hhintcnt++;
						}	
					}

					//check down
					if( i+1 < PUZZLE_DIFFICULTY && j+1 < PUZZLE_DIFFICULTY){
						if( items[i][j].src == items[i+1][j+1].src){
							hhint[hhintcnt] = [];
							hhint[hhintcnt][0] = i+1;
							hhint[hhintcnt][1] = j+1;
							hhint[hhintcnt][2] = "middledown";
							hhintcnt++;
						}
					}
				}
			}
		}
	}
	return hhint;
}

function setTime()
{
	--totalSeconds;
	secondsLabel = pad(totalSeconds%60);
	minutesLabel = pad(parseInt(totalSeconds/60));
	document.getElementById("timer").innerHTML = "Timer: " + minutesLabel + ":" + secondsLabel;
	if(totalSeconds == 0){
		clearInterval(timer);
		if(score >= 20000){
			alert("Level 3");
			window.location.href = "difficult3.html";
		}else{
			alert("game over");
			window.location.href = "index.html";
		}
	}
}

function pad(val)
{
	var valString = val + "";
	if(valString.length < 2){
		return "0" + valString;
	}else{
		return valString;
	}
}

window.addEventListener("load", init, false);

		