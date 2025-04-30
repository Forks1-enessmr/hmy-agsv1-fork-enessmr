// by koeqaife ;)

import popupwindow from "../misc/popupwindow.ts";
import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk";
import Gio from "gi://Gio";
import { MaterialIcon } from "icons.ts";
import { WeatherBox } from "./weather.ts";
import { Media } from "./players.ts";
import { Applauncher } from "./applauncher.ts";
import { geminiPage } from "./gemini.ts";
import { chatsPage } from "./chats.ts";
import Pango from "gi://Pango";
import Cairo from "gi://cairo?version=1.0";
import config from "services/configuration";

export const WINDOW_NAME = "sideleft";
export const shown = Variable("weather");

export function toggleAppsWindow() {
    if (shown.value == "apps" && sideleft.visible) App.closeWindow(WINDOW_NAME);
    else {
        shown.setValue("apps");
        App.openWindow(WINDOW_NAME);
    }
}
export function toggleMediaWindow() {
    if (shown.value == "media" && sideleft.visible) App.closeWindow(WINDOW_NAME);
    else {
        shown.setValue("media");
        App.openWindow(WINDOW_NAME);
    }
}

globalThis.toggleMediaWindow = toggleMediaWindow;
globalThis.toggleAppsWindow = toggleAppsWindow;

type ButtonType = {
    page: string;
    label: string;
    icon?: string;
    icon_widget?: Gtk.Widget;
};

function Button({ page, label, icon, icon_widget }: ButtonType) {
    return Widget.Button({
        class_name: `navigation_button _${page}`,
        hexpand: true,
        vpack: "start",
        child: Widget.Box({
            orientation: Gtk.Orientation.VERTICAL,
            class_name: "container_outer",
            children: [
                Widget.Overlay({
                    child: Widget.Box({
                        orientation: Gtk.Orientation.VERTICAL,
                        hpack: "center",
                        class_name: "container"
                    }),
                    overlay: icon ? MaterialIcon(icon!, "20px") : icon_widget!,
                    pass_through: true
                }),
                Widget.Label({
                    label: label,
                    class_name: "label"
                })
            ]
        }),
        on_clicked: () => {
            shown.setValue(page);
        },
        setup: (self) => {
            self.hook(shown, () => {
                self.toggleClassName("active", shown.value == page);
            });
        }
    });
}

function Navigation() {
    let stack = Widget.Stack({
        children: {
            weather: WeatherBox(),
            media: Media(),
            apps: Applauncher(),
            gemini: geminiPage,
            chats: config.config.show_beta ? chatsPage : Widget.Label("Beta functions disabled")
        },
        hexpand: true,
        transition: "crossfade",
        transitionDuration: 200,
        // @ts-expect-error
        shown: shown.bind(),
    });
    const buttons = Widget.Box({
        class_name: "rail",
        vertical: true,
        vexpand: true,
        hpack: "start",
        children: [
            Button({
                page: "weather",
                label: "Weather",
                icon: "cloud"
            }),
            Button({
                page: "media",
                label: "Players",
                icon: "music_note"
            }),
            Button({
                page: "apps",
                label: "Apps",
                icon: "search"
            }),
            Button({
                page: "gemini",
                label: "Gemini",
                icon_widget: Widget.Icon({
                    icon: "google-gemini-symbolic",
                    size: 20,
                    class_name: "icon"
                })
            })
        ]
    });
    if (config.config.show_beta) {
        buttons.add(
            Button({
                page: "chats",
                label: "Chat",
                icon: "chat"
            })
        );
    }
    return Widget.Box({
        vexpand: true,
        class_name: "sideleft",
        css: 'margin-right: 40px',
        children: [buttons, stack],
        hexpand: true,
        setup: (self) => {
            const keys = Object.keys(stack.children);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                // @ts-expect-error
                self.keybind(`${i + 1}`, () => {
                    shown.setValue(key);
                });
            }
        }
    });
}

function SideLeft() {
    return Widget.Box({
        class_name: "sideleft_main_box",
        hexpand: true,
        children: [
            Navigation()
            /*Widget.EventBox({
                class_name: "rounded-mask-box",
                width_request: 477,
                height_request: 200,
                child: Widget.Box({
                    class_name: "transparent-content-box",
                    children: [],
                }),
                setup: (eventbox) => {
                    eventbox.connect('realize', () => {
                        const window = eventbox.get_window();
                        if (!window) return;
                        
                        // Using DrawingArea instead of direct Cairo manipulation
                        const drawingArea = new Gtk.DrawingArea();
                        drawingArea.set_size_request(477, 200);
                        
                        drawingArea.connect('draw', (_, cr) => {
                            // Clear the surface
                            cr.setOperator(Cairo.Operator.CLEAR);
                            cr.paint();
                            cr.setOperator(Cairo.Operator.OVER);
                            
                            // Set the fill color (adjust as needed)
                            cr.setSourceRGBA(1, 1, 1, 1);
                            
                            // Draw the main shape
                            const cornerRadius = 20;
                            
                            // Start path
                            cr.save();
                            
                            // Add rounded rectangle
                            cr.save();
                            cr.newPath();
                            
                            // Main rectangle
                            cr.save();
                            cr.newPath();
                            cr.rectangle(0, 0, 477, 200);
                            cr.restore();
                            
                            // Add corner
                            cr.save();
                            cr.newPath();
                            
                            // Draw corner using lines and arcs
                            // Use low-level path commands that work with your Cairo bindings
                            const x = -cornerRadius;
                            const y = 0;
                            
                            cr.newSubPath();
                            cr.moveTo(x, y);
                            cr.lineTo(0, 0);
                            cr.lineTo(0, cornerRadius);
                            cr.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 1.5);
                            cr.closePath();
                            cr.fill();
                            
                            cr.restore();
                            cr.restore();
                            
                            return false;
                        });
                        
                        // Create a region from the drawing
                        const region = new Gdk.Region();
                        
                        // Add the main rectangle
                        const rect = new Gdk.Rectangle();
                        rect.x = 0;
                        rect.y = 0;
                        rect.width = 477;
                        rect.height = 200;
                        
                        region.unionWithRect(rect);
                        
                        // Apply the region to the window
                        window.shape_combine_region(region, 0, 0);
                    });
                },
            }),*/
        ]
    });
}

export const sideleft = popupwindow({
    name: WINDOW_NAME,

    class_name: "sideleft",
    visible: false,
    keymode: "exclusive",
    child: SideLeft(),
    anchor: ["top", "left", "bottom"],
    css: "min-width: 490px;",
    width_request: 490,
});