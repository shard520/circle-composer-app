const cells = document.querySelectorAll('.cell');

const sequence = {
	cell: true,
	
}



for (let cell = 0; cell < cells.length; cell++) {
	cells[cell].onclick = ( () => {
		cells[cell].classList.toggle("on");
		console.log(cells[cell].classList);
		const sound = new Audio("sounds/crash.mp3");
		sound.play();
	})
}