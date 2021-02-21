const cells = document.querySelectorAll('.cell');

for (let cell = 0; cell < cells.length; cell++) {
	cells[cell].onclick = ( () => {
		cells[cell].classList.toggle("on");
	})
}