export function toIsoStringWithTimezone(date) {
	const offset = -date.getTimezoneOffset();
	const sign = offset >= 0 ? "+" : "-";
	const pad = (num) => {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? "0" : "") + norm;
	};

	return (
		date.getFullYear() +
		"-" +
		pad(date.getMonth() + 1) +
		"-" +
		pad(date.getDate()) +
		"T" +
		pad(date.getHours()) +
		":" +
		pad(date.getMinutes()) +
		":" +
		pad(date.getSeconds()) +
		sign +
		pad(offset / 60) +
		":" +
		pad(offset % 60)
	);
}

export function formatDate(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const formattedHours = hours.toString().padStart(1, "0");

	return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
}
