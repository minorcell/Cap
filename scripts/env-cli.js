import * as fs from "node:fs/promises";
import { group, intro, isCancel, outro, text } from "@clack/prompts";

const profilePath = "./target/env-profiles/default.json";

async function readProfile() {
	const file = await fs.readFile(profilePath, "utf8").catch(() => null);
	return file ? JSON.parse(file) : {};
}

function buildEnvContent(envs) {
	return Object.entries(envs)
		.map(([key, value]) => `${key}=${value}`)
		.join("\n");
}

async function main() {
	intro("Cap desktop env setup");

	const stored = await readProfile();

	const answers = await group(
		{
			VITE_SERVER_URL: () =>
				text({
					message: "VITE_SERVER_URL",
					defaultValue: stored.VITE_SERVER_URL ?? "https://cap.so",
					placeholder: "https://cap.so",
				}),
			VITE_VERCEL_AUTOMATION_BYPASS_SECRET: () =>
				text({
					message: "VITE_VERCEL_AUTOMATION_BYPASS_SECRET (optional)",
					defaultValue:
						stored.VITE_VERCEL_AUTOMATION_BYPASS_SECRET ?? "",
				}),
			VITE_POSTHOG_KEY: () =>
				text({
					message: "VITE_POSTHOG_KEY (optional)",
					defaultValue: stored.VITE_POSTHOG_KEY ?? "",
				}),
			VITE_POSTHOG_HOST: () =>
				text({
					message: "VITE_POSTHOG_HOST (optional)",
					defaultValue: stored.VITE_POSTHOG_HOST ?? "",
				}),
		},
		{ onCancel: () => process.exit(0) },
	);

	if (isCancel(answers)) return;

	const envs = {
		NODE_ENV: "development",
		RUST_BACKTRACE: "1",
		VITE_SERVER_URL: answers.VITE_SERVER_URL || "https://cap.so",
	};

	if (answers.VITE_VERCEL_AUTOMATION_BYPASS_SECRET) {
		envs.VITE_VERCEL_AUTOMATION_BYPASS_SECRET =
			answers.VITE_VERCEL_AUTOMATION_BYPASS_SECRET;
	}

	if (answers.VITE_POSTHOG_KEY) {
		envs.VITE_POSTHOG_KEY = answers.VITE_POSTHOG_KEY;
	}

	if (answers.VITE_POSTHOG_HOST) {
		envs.VITE_POSTHOG_HOST = answers.VITE_POSTHOG_HOST;
	}

	await fs.writeFile(".env", buildEnvContent(envs));
	await fs.mkdir("target/env-profiles", { recursive: true });
	await fs.writeFile(profilePath, JSON.stringify({ ...stored, ...envs }, null, 4));

	outro("Desktop env saved to .env");
}

main();
