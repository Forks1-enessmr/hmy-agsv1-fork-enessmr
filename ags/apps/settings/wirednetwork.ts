// by koeqaife ;)

import { timeout } from "resource:///com/github/Aylur/ags/utils.js";
import { MaterialIcon } from "icons";
const systemtray = await Service.import("systemtray");
const network = await Service.import("network");
import { current_tab, saved_networks, current_window } from "./variables";
import Box from "types/widgets/box";
import Revealer from "types/widgets/revealer";

const WIFI_ICONS = {
    "network-wireless-signal-excellent-symbolic": "signal_wifi_4_bar",
    "network-wireless-signal-good-symbolic": "network_wifi_3_bar",
    "network-wireless-signal-ok-symbolic": "network_wifi_2_bar",
    "network-wireless-signal-weak-symbolic": "network_wifi_1_bar",
    "network-wireless-signal-none-symbolic": "signal_wifi_0_bar"
};

const LAN_ICONS = {
    "lan-symbolic": "lan"
};

type AccessPoint = {
    address: string | null;
    lastSeen: number;
    active: boolean;
    strength: number;
    frequency: number;
    iconName: string | undefined;
};

Utils.interval(15000, () => {
    if (current_tab.value != "internet" || !current_window?.visible) return;
    if (!network.wired) return;
});

const network_state = {
    unavailable: "Device is unavailable",
    disconnected: "Device is disconnected",
    prepare: "Preparing to connect...",
    config: "Configuring connection...",
    ip_config: "Obtaining IP address...",
    ip_check: "Verifying IP address...",
    secondaries: "Setting up secondary connections...",
    activated: "Connected",
    deactivating: "Disconnecting...",
    failed: "Connection failed"
};

export const WiredNetwork = () => {
    const wired = network.wired;
    const icon = MaterialIcon("lan", "20px");
    const info = Widget.Box({
        vertical: true,
        vpack: "center",
        children: [
            Widget.Label({
                class_name: "title",
                label: "Wired Connection",
                hpack: "start",
                vpack: "center"
            }),
            Widget.Revealer({
                child: Widget.Label({
                    class_name: "description",
                    label: "",
                    hpack: "start",
                    visible: true
                }),
                reveal_child: false
            })
        ]
    });

    const button = Widget.Button({
        class_name: "row",
        attribute: {
            update: () => {
                const isConnected = wired.internet === "connected";
                button.toggleClassName("active", isConnected);
                
                const description_revealer = info.children[1] as Revealer<any, any>;
                const description = description_revealer.child;
                
                if (isConnected) {
                    const speed = wired.speed > 1000 
                        ? `${(wired.speed / 1000).toFixed(1)} Gbit/s` 
                        : `${wired.speed} Mbit/s`;
                    description.label = `${speed} • ${network_state[wired.state]}`;
                    description_revealer.set_reveal_child(true);
                } else {
                    description.label = network_state[wired.state];
                    description_revealer.set_reveal_child(wired.state !== "disconnected");
                }
            }
        },
        child: Widget.Box({
            class_name: "wired_network_box",
            children: [icon, info]
        })
    });

    button.attribute.update();
    return button;
};

const WiredSection = () => Widget.Box({
    vertical: true,
    visible: network.wired.bind("state").as(state => 
        state !== "unavailable" && state !== "disconnected"
    ),
    children: [
        Widget.Separator(),
        Widget.Label({
            class_name: "subtitle",
            label: "Wired",
            hpack: "start"
        }),
        WiredNetwork()
    ]
});

// Update the exported function to include both wireless and wired
export function InternetPanel() {
    const box = Widget.Box({
        vertical: true,
        children: [
            WiredSection()
        ]
    });
    
    return Widget.Scrollable({
        hscroll: "never",
        child: box,
        vexpand: true
    });
}
