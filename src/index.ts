import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import chokidar, { type FSWatcher } from "chokidar";
import StyleDictionary from "style-dictionary-utils";
import type { Options } from "./types";

function rebuildStyleDictionary(options: Options) {
	try {
		const s = StyleDictionary.extend(options);

		s.buildAllPlatforms();
	} catch (error) {
		if (error instanceof Error) {
			console.error("\x1b[31m%s\x1b[0m", error.message);
		}
	}
}

export const unpluginFactory: UnpluginFactory<Options> = (options) => {
	let watchers: FSWatcher[] = [];

	return {
		name: "unplugin-style-dictionary-utils",
		buildStart() {
			const globs = [...(options.include ?? []), ...(options.source ?? [])];

			rebuildStyleDictionary(options);

			watchers = globs.map((glob) => {
				const watcher = chokidar
					.watch(glob, {
						ignoreInitial: true,
					})
					.on("change", () => rebuildStyleDictionary(options))
					.on("add", () => rebuildStyleDictionary(options))
					.on("unlink", () => rebuildStyleDictionary(options));

				return watcher;
			});
		},

		buildEnd() {
			for (const watcher of watchers) {
				watcher.close();
			}
		},
	};
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
