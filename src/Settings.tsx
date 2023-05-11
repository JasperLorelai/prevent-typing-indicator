import { components, util } from "replugged";
const { FormItem, TextArea, SwitchItem } = components;

import { settingValues } from "./index";

export function Settings() {
  return (
    <>
      <FormItem title="Channel IDs to ignore. Put each on newline.">
        <TextArea {...util.useSetting(settingValues, "ignoredChannelIds", "")} />
      </FormItem>
      <SwitchItem {...util.useSetting(settingValues, "log", false)}>Log</SwitchItem>;
    </>
  );
}
