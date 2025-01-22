function slowScrollDown(speed) {
	// Ensure speed is a number greater than 0
	speed = Math.max(speed, 1);

	const distanceToScroll = document.body.scrollHeight - window.innerHeight;
	let scrolled = 0;

	const scrollInterval = setInterval(() => {
		// Calculate remaining distance to scroll
		const remaining = distanceToScroll - scrolled;

		// Scroll by a smaller amount based on speed
		const scrollAmount = Math.min(remaining, speed);
		window.scrollBy(0, scrollAmount);

		scrolled += scrollAmount;

		// Stop scrolling when reaching the bottom
		if (scrolled >= distanceToScroll) {
			clearInterval(scrollInterval);
		}
	}, 16); // Adjust interval for desired smoothness (lower value for smoother scrolling)
}

// Example usage:
//slowScrollDown(50); // Scroll down slowly with a speed of 50 pixels per interval
