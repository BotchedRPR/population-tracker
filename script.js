const counters = [
	{
		id: "koscierzyna",
		name: "Kościerzyna",
		startPopulation: 23353,
		startDate: new Date("2024-06-01T00:00:00"),
		births: 98,
		deaths: 130
	},
	{
		id: "powiat-koscierzynski",
		name: "Powiat Kościerski",
		startPopulation: 72201,
		startDate: new Date("2024-06-01T00:00:00"),
		births: 309,
		deaths: 361
	},
	{
		id: "wojewodztwo-pomorskie",
		name: "Województwo Pomorskie",
		startPopulation: 2359956,
		startDate: new Date("2024-06-01T00:00:00"),
		births: 8893,
		deaths: 11643
	},
	{
		id: "polska",
		name: "Polska",
		startPopulation: 37563071,
		startDate: new Date("2024-06-01T00:00:00"),
		births: 125637,
		deaths: 20336
	}
];

const secondsInHalfYear = 181 * 24 * 3600;
let currentCounterIndex = 0;

// Function to calculate the population
function calculatePopulation(counter) {
	const now = new Date();
	const elapsedSeconds = Math.floor((now - counter.startDate) / 1000);

	const birthInterval = secondsInHalfYear / counter.births;
	const deathInterval = secondsInHalfYear / counter.deaths;

	const births = Math.floor(elapsedSeconds / birthInterval);
	const deaths = Math.floor(elapsedSeconds / deathInterval);

	return counter.startPopulation + births - deaths;
}

// Function to format time for the next event
function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const sec = Math.floor(seconds % 60);
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Function to calculate the time to the next event
function calculateNextEvent(counter) {
	const now = new Date();
	const elapsedSeconds = Math.floor((now - counter.startDate) / 1000);

	const birthInterval = secondsInHalfYear / counter.births;
	const deathInterval = secondsInHalfYear / counter.deaths;

	const nextBirthIn = birthInterval - (elapsedSeconds % birthInterval);
	const nextDeathIn = deathInterval - (elapsedSeconds % deathInterval);

	return { nextBirthIn, nextDeathIn };
}

const proportion = 5000;

// Function to animate and update the content
function animateContent() {
	const container = document.querySelector(".counter-container");

	// Ensure the container exists
	if (!container) {
		console.error("The container element is missing.");
		return;
	}

	// Wait for the slide-out animation to finish before sliding in again
	setTimeout(() => {
		// After the slide-out, now slide in
		container.classList.remove("slide-out");
		container.classList.add("slide-in");

		// Ensure counters and currentCounterIndex are defined
		if (typeof currentCounterIndex === 'undefined' || !counters || counters.length === 0) {
			console.error("Counters or currentCounterIndex is not defined correctly.");
			return;
		}

		// Get the current counter object
		const currentCounter = counters[currentCounterIndex];
		const population = calculatePopulation(currentCounter);  // Ensure this function returns a valid number
		const { nextBirthIn, nextDeathIn } = calculateNextEvent(currentCounter);

		console.log("Population:", population);  // Debug log to ensure population has a valid value

		// Ensure elements exist before updating them
		const counterNameElement = document.querySelector("#counter-name");
		const counterPopulationElement = document.querySelector("#counter-population");
		const counterNextEventElement = document.querySelector("#counter-next-event");

		if (counterNameElement && counterPopulationElement && counterNextEventElement) {
			// Update the content dynamically
			counterNameElement.textContent = currentCounter.name;

			// Update the population content
			if (population !== undefined && population !== null) {
				counterPopulationElement.textContent = population.toString();  // Ensure population is converted to string
			} else {
				console.error("Population value is invalid.");
			}

			// Update the next event content
			counterNextEventElement.textContent = nextBirthIn <= nextDeathIn
				? `Za ${formatTime(nextBirthIn)} nastąpi urodzenie`
				: `Za ${formatTime(nextDeathIn)} nastąpi zgon`;
		} else {
			console.error("One or more elements are missing.");
		}

		// Cycle to the next counter
		currentCounterIndex = (currentCounterIndex + 1) % counters.length;

		// Wait for the content to be updated, then slide out to the right
		setTimeout(() => {
			container.classList.remove("slide-in");
			container.classList.add("slide-out");
		}, proportion); // Delay to allow time for content update before sliding out

	}, proportion/2); // Wait for the slide-in to complete before updating content
}


// Start the animation cycle
function startAnimation() {
	// Create and inject the container dynamically
	const container = document.createElement("div");
	container.classList.add("counter-container");
	container.innerHTML = `
	    <h1 id="counter-name"></h1>
	    <div class="counter">
		<div id="counter-population"></div>
	    </div>
	    <p id="counter-next-event"></p>
	`;
	document.getElementById("counters-container").appendChild(container);

	// Ensure counters and currentCounterIndex are defined
	if (!counters || counters.length === 0) {
		console.error("No counters data available.");
		return;
	}

	// Initialize content and animation
	animateContent();
	setInterval(animateContent, proportion*2); // Adjust interval as needed
}

document.addEventListener("DOMContentLoaded", startAnimation);
