import type { Options } from "./types";

import unplugin from ".";

export default (options: Options) => ({
	name: "unplugin-style-dictionary-utils",
	hooks: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		"astro:config:setup": async (astro: any) => {
			astro.config.vite.plugins ||= [];
			astro.config.vite.plugins.push(unplugin.vite(options));
		},
	},
});
