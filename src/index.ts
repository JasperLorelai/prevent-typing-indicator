import { Injector, Logger, settings, webpack } from "replugged";

interface SettingsInterface {
  ignoredChannelIds?: string;
  log?: boolean;
}

const PLUGIN_ID = require("../manifest.json").id;
const inject = new Injector();
const logger = Logger.plugin("PreventTyping");
export const settingValues = await settings.init<SettingsInterface>(PLUGIN_ID);
import { Settings } from "./Settings";
export { Settings };

export async function start(): Promise<void> {
  const typingMod = await webpack.waitForModule<{
    startTyping: (channelId: string) => void;
  }>(webpack.filters.byProps("startTyping"));
  const getChannelMod = await webpack.waitForModule<{
    getChannel: (id: string) => {
      name: string;
    };
  }>(webpack.filters.byProps("getChannel"));

  if (!(typingMod && getChannelMod)) return;
  inject.instead(typingMod, "startTyping", ([channelId], orig) => {
    const ignoredChannelIds = settingValues
      .get("ignoredChannelIds", "")
      .split("\n")
      .map((e) => e.match(/\d+/)?.[0])
      .filter((e) => e);
    if (ignoredChannelIds.includes(channelId)) {
      orig(channelId);
      return;
    }

    if (!settingValues.get("log")) return;
    const channel = getChannelMod.getChannel(channelId);
    logger.log(`Typing prevented! Channel: #${channel?.name ?? "unknown"} (${channelId}).`);
  });
}

export function stop(): void {
  inject.uninjectAll();
}
