document.getElementById("spinButton").addEventListener("click", myfunction);

var rnumber=Math.floor(Math.random()*16);
var deg = 30*360 + rnumber*22.5;
var deg2=deg-30*360;

function myfunction(){
	var number = document.getElementById("myText").value;
	var color = document.getElementById("myText2").value;
	var number1 = Number(number) 
	document.getElementById('box').style.transform = "rotate("+deg+"deg)";
	var element = document.getElementById('mainbox');
	element.classList.remove('animate');
	setTimeout(function(){
		element.classList.add('animate');
	}, 5000); //5000 = 5 second
	if(color=="red" || color=="RED" || color=="Red"){
		if(deg2==22.5 ||deg2==67.5 || deg2==112.5 || deg2==157.5 || deg2== 202.5 || deg2==247.5 || deg2==292.5 || deg2==337.5){
			winr = number1*1.5;
			setTimeout(function(){alert("You win "+winr); }, 5500);
		}
		else{
			setTimeout(function(){alert("You lose"); }, 5500);
		}
	}
	else if(color=="black" || color=="BLACK" || color=="Black"){
		if(deg2==0||deg2==45 ||deg2==270 || deg2==135 || deg2==180 || deg2== 225 || deg2==315 || deg2==360){
			winb = number1*2;
			setTimeout(function(){alert("You win "+winb); }, 5500);
		}//black color
		else{
			setTimeout(function(){alert("You lose"); }, 5500);
		}
	}	
	else if(color=="green" || color=="GREEN" || color=="Green"){
		if(deg2==90){
			wing = number1*5;
			setTimeout(function(){alert("You win "+wing); }, 5500);
		}
		else{
			setTimeout(function(){alert("You lose"); }, 5500);
		}
	}else{
		setTimeout(function(){alert("You lose"); }, 5500);
	}
	setTimeout(function(){
		location.reload();
	}, 7000);
}