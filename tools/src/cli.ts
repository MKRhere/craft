import launcher from "./launcher";
import client from "./client";

const cmd = process.argv[2];

function main() {
	switch (cmd) {
		case "client":
			return client();
		default:
			return launcher();
	}
}

main();
