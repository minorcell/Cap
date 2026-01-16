import { type } from "@tauri-apps/plugin-os";
import { createResource, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { generalSettingsStore } from "~/store";
import type { GeneralSettingsStore } from "~/utils/tauri";
import { ToggleSettingItem } from "./Setting";

export default function ExperimentalSettings() {
	const [store] = createResource(() => generalSettingsStore.get());

	return (
		<Show when={store.state === "ready" && ([store()] as const)}>
			{(store) => <Inner initialStore={store()[0] ?? null} />}
		</Show>
	);
}

function Inner(props: { initialStore: GeneralSettingsStore | null }) {
	const [settings, setSettings] = createStore<GeneralSettingsStore>(
		props.initialStore ?? {
			uploadIndividualFiles: false,
			hideDockIcon: false,
			autoCreateShareableLink: false,
			enableNotifications: true,
			enableNativeCameraPreview: false,
			autoZoomOnClicks: false,
			custom_cursor_capture2: true,
		},
	);

	const handleChange = async <K extends keyof typeof settings>(
		key: K,
		value: (typeof settings)[K],
	) => {
		console.log(`Handling settings change for ${key}: ${value}`);

		setSettings(key as keyof GeneralSettingsStore, value);
		generalSettingsStore.set({ [key]: value });
	};

	return (
		<div class="flex flex-col h-full custom-scroll">
			<div class="p-4 space-y-4">
				<div class="flex flex-col pb-4 border-b border-gray-2">
					<h2 class="text-lg font-medium text-gray-12">实验性功能</h2>
					<p class="text-sm text-gray-10">
						这些功能仍在开发中，可能无法稳定运行或表现不一致。
					</p>
				</div>
				<div class="space-y-3">
					<h3 class="text-sm text-gray-12 w-fit">录制功能</h3>
					<div class="px-3 rounded-xl border divide-y divide-gray-3 border-gray-3 bg-gray-2">
						<ToggleSettingItem
							label="Studio 模式自定义光标捕捉"
							description="Studio 模式录制会单独捕捉光标状态，便于在编辑器中调整大小与平滑。该功能仍属实验，光标事件可能无法完全准确采集。"
							value={!!settings.custom_cursor_capture2}
							onChange={(value) =>
								handleChange("custom_cursor_capture2", value)
							}
						/>
						{type() !== "windows" && (
							<ToggleSettingItem
								label="原生摄像头预览"
								description="通过原生 GPU 表面显示摄像头预览，而非在 WebView 内渲染。部分 Windows 系统不支持，表现可能不稳定。"
								value={!!settings.enableNativeCameraPreview}
								onChange={(value) =>
									handleChange("enableNativeCameraPreview", value)
								}
							/>
						)}
						<ToggleSettingItem
							label="点击自动缩放"
							description="Studio 模式录制过程中会在鼠标点击位置自动生成缩放片段，突出重要交互。"
							value={!!settings.autoZoomOnClicks}
							onChange={(value) => {
								handleChange("autoZoomOnClicks", value);
								setTimeout(
									() => window.scrollTo({ top: 0, behavior: "instant" }),
									5,
								);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
