const logUrl: string = "undefined"; // this value will be replaced by vite-plugin-logger at build time
const logs: { timestamp: number; message: string }[] = [];

function handleArgs(...obj: unknown[]) {
	const logType = obj[0];
	const firstIdentifier = obj[1];
	const secondIdentifier = obj[2];

	// console.log({ ...obj });

	if (firstIdentifier) {
		if (secondIdentifier) {
			obj[0] = `%c[${logType}] [${firstIdentifier}] %c[${secondIdentifier}]`;
			obj[1] = "color: gray;";
			obj[2] = "color: #bbbbbb;";
		} else {
			obj[0] = `%c[${logType}] [${firstIdentifier}]`;
			obj[1] = "color: gray;";
			obj.splice(2, 1);
		}
	} else if (secondIdentifier) {
		obj[0] = `%c[${logType}] %c[${secondIdentifier}]`;
		obj[1] = "color: gray;";
		obj[2] = "color: #bbbbbb;";
	} else {
		obj[0] = `%c[${logType}]`;
		obj[1] = "color: gray;";
		obj.splice(2, 1);
	}

	// console.log({ first: logType, second: firstIdentifier, obj });

	return obj;
}

export function log(...obj: unknown[]) {
	console.log(...obj);
	handleExternalLogs(...obj);
}

export function logVerbose(...obj: unknown[]) {
	console.error(...handleArgs("VERBOSE", ...obj));

	handleExternalLogs("[VERBOSE]", ...obj);
}

export function logError(...obj: unknown[]) {
	console.error(...handleArgs("ERROR", ...obj));

	handleExternalLogs("[ERROR]", ...obj);
}

export function logWarn(...obj: unknown[]) {
	console.warn(...handleArgs("WARN", ...obj));

	handleExternalLogs("[WARN]", ...obj);
}

export function trace(...obj: unknown[]) {
	console.debug(...handleArgs("TRACE", ...obj));

	handleExternalLogs("[TRACE]", ...obj);
}

export function traceWarn(...obj: unknown[]) {
	console.warn(...handleArgs("TRACE", ...obj));

	handleExternalLogs("[TRACE]", "[WARN]", ...obj);
}

export function traceWithStacktrace(...obj: unknown[]) {
	const stackTrace = new Error().stack;
	console.debug(...handleArgs("TRACE", ...obj, stackTrace));

	handleExternalLogs("[TRACE]", ...obj, stackTrace);
}

export function sendLogs() {
	const request = new Request(logUrl, {
		body: JSON.stringify(logs),
		method: "POST",
	});
	logs.length = 0;
	console.log("sending", request);
	fetch(request);
}

function handleExternalLogs(...obj: unknown[]) {
	const body = {
		timestamp: performance.now(),
		message: JSON.stringify(obj),
	};
	logs.push(body);
}
