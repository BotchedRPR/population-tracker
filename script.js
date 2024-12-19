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

function createCounter(counter) {
	const birthInterval = secondsInHalfYear / counter.births;
	const deathInterval = secondsInHalfYear / counter.deaths;
	let firstUpdate = true;

	function calculatePopulation() {
		const now = new Date();
		const elapsedSeconds = Math.floor((now - counter.startDate) / 1000);

		const births = Math.floor(elapsedSeconds / birthInterval);
		const deaths = Math.floor(elapsedSeconds / deathInterval);

		return counter.startPopulation + births - deaths;
	}

	function calculateNextEvent() {
		const now = new Date();
		const elapsedSeconds = Math.floor((now - counter.startDate) / 1000);

		const nextBirthIn = birthInterval - (elapsedSeconds % birthInterval);
		const nextDeathIn = deathInterval - (elapsedSeconds % deathInterval);

		return { nextBirthIn, nextDeathIn };
	}

	function updateDisplay() {
		const populationElement = document.getElementById(`${counter.id}-population`);
		const newPopulation = calculatePopulation();

		if (firstUpdate) {
			setPopulation(populationElement, newPopulation, true);
			firstUpdate = false;
		} else {
			const currentPopulation = parseInt(
				populationElement.querySelector(".digit.show").textContent.replace(/\s+/g, '')
			);
			if (currentPopulation !== newPopulation) {
				setPopulation(populationElement, newPopulation, false);
			}
		}

		const { nextBirthIn, nextDeathIn } = calculateNextEvent();
		const nextEventText =
			nextBirthIn <= nextDeathIn
				? `Zmiana nastąpi za: ${formatTime(nextBirthIn)}`
				: `Zmiana nastąpi za: ${formatTime(nextDeathIn)}`;

		document.getElementById(`${counter.id}-next-event`).textContent = nextEventText;
	}

	function setPopulation(element, newPopulation, instant) {
		const newDigitElement = document.createElement("div");
		newDigitElement.classList.add("digit");
		if (!instant) {
			newDigitElement.classList.add("show");
		}
		newDigitElement.textContent = newPopulation.toLocaleString("pl-PL");

		const currentDigit = element.querySelector(".digit.show");
		if (currentDigit) {
			currentDigit.classList.remove("show");
			currentDigit.classList.add("hide");
			setTimeout(() => currentDigit.remove(), 500);
		}

		element.appendChild(newDigitElement);

		if (instant) {
			newDigitElement.classList.add("show");
		} else {
			setTimeout(() => newDigitElement.classList.add("show"), 10);
		}
	}

	function formatTime(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const sec = Math.floor(seconds % 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
	}

	const container = document.createElement("div");
	container.classList.add("counter-container");
	container.innerHTML = `
        <h1>${counter.name}</h1>
        <div class="counter" id="${counter.id}-population">
            <div class="digit show">${counter.startPopulation.toLocaleString("pl-PL")}</div>
        </div>
        <p id="${counter.id}-next-event">Czas do zmiany: --:--:--</p>
    `;
	document.getElementById("counters-container").appendChild(container);

	updateDisplay();
	setInterval(updateDisplay, 1000);
}

counters.forEach(createCounter);

// Pobierz elementy
const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');

// Funkcja otwierająca modal
openModal.addEventListener('click', function(event) {
    event.preventDefault(); // Zapobiega domyślnemu działaniu linku
    modal.style.display = 'flex';
});

// Funkcja zamykająca modal
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Zamknięcie modalu po kliknięciu poza okno
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
