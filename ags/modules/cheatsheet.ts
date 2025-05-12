// by koeqaife ;)

/*

import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import popupwindow from "modules/misc/popupwindow";
import { MaterialIcon } from "icons";
const hyprland = await Service.import("hyprland");

const WINDOW_NAME = "cheatsheet";

const load_keybindings_cmd = `python -OOO ${App.configDir}/scripts/keybindings.py`;
let _keybindings = Utils.exec(load_keybindings_cmd);
const keybindings = Variable(JSON.parse(_keybindings));

const monitor = Gdk.Display.get_default()?.get_primary_monitor();
const screen = Gdk.Screen.get_default();
const screenWidth = screen!.get_width();
const screenHeight = screen!.get_height();

const responsiveWidth = Math.round(screenWidth* 0.89);
const responsiveHeight = Math.round(screenHeight * 0.83);

// hyprland.connect("event", (hyprland, name) => {
//     if (name == "configreloaded") {
//         print(name)
//         Utils.execAsync(load_keybindings_cmd).then((out) => {
//             keybindings.setValue(JSON.parse(out));
//         });
//     }
// })

const icons = {
    super: ""
};

const replace = {
    slash: "/",
    period: ".",
    escape: "Esc"
};

const category_icons = {
    actions: "accessibility_new",
    applications: "apps",
    windows: "select_window",
    workspaces: "overview_key",
    misc: "construction",
    tools: "build"
};

const CheatSheet = () =>
    Widget.FlowBox({
        attribute: {
            set: (self) => {
                for (let category in keybindings.value) {
                    const box = Widget.Box({
                        class_name: "category",
                        vertical: true,
                        vpack: "fill",
                        children: [
                            Widget.Box({
                                children: [
                                    MaterialIcon(category_icons[category.toLowerCase()] || "category"),
                                    Widget.Label({
                                        label: category,
                                        class_name: "title",
                                        hpack: "start"
                                    })
                                ]
                            }),
                            Widget.Separator()
                        ]
                    });
                    let commands = keybindings.value[category];
                    for (const command in commands) {
                        const _command = command.replaceAll(" ", " + ");
                        const key_list = _command.split(" ");
                        const key_box = Widget.Box({
                            class_name: "row"
                        });
                        for (const key of key_list) {
                            if (key == "+")
                                key_box.pack_start(
                                    Widget.Label({
                                        label: "+",
                                        class_name: "plus",
                                        hpack: "start",
                                        vpack: "center"
                                    }),
                                    false,
                                    false,
                                    0
                                );
                            else if (icons[key])
                                key_box.pack_start(
                                    Widget.Label({
                                        label: icons[key],
                                        class_name: "awesome_icon key",
                                        hpack: "start",
                                        vpack: "center"
                                    }),
                                    false,
                                    false,
                                    0
                                );
                            else
                                key_box.pack_start(
                                    Widget.Label({
                                        label: replace[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1),
                                        class_name: "key",
                                        hpack: "start",
                                        vpack: "center"
                                    }),
                                    false,
                                    false,
                                    0
                                );
                        }
                        key_box.pack_start(
                            Widget.Label({
                                label: `: `,
                                class_name: "separator",
                                hpack: "start",
                                vpack: "center"
                            }),
                            false,
                            false,
                            0
                        );
                        key_box.pack_start(
                            Widget.Label({
                                label: `${commands[command]}`,
                                class_name: "description",
                                hpack: "start",
                                vpack: "center"
                            }),
                            false,
                            false,
                            0
                        );
                        box.pack_start(key_box, false, false, 0);
                    }
                    self.add(box);
                }
            }
        },
        setup: (self) => {
            self.set_max_children_per_line(3);
            self.set_min_children_per_line(3);
            self.set_hexpand(true)  // ← Critical
            self.set_vexpand(true)  // ← Critical
            self.set_halign(Gtk.Align.FILL)  // ← Fill horizontal space
            self.set_valign(Gtk.Align.FILL)  // ← Fill vertical space
            self.set_selection_mode(Gtk.SelectionMode.NONE);
            self.attribute.set(self);
        }
    });

export const cheatsheet = popupwindow({
    name: WINDOW_NAME,

    class_name: "cheatsheet",
    visible: false,
    keymode: "exclusive",
    child: Widget.Box({
        widthRequest: responsiveWidth,  // Set desired width
        heightRequest: responsiveHeight, // Set desired height
        child: CheatSheet(),
    }),
    anchor: []
}); */

import Gtk from "gi://Gtk?version=3.0";
import Gdk from "gi://Gdk?version=3.0";
import popupwindow from "modules/misc/popupwindow";
import { MaterialIcon } from "icons";
const hyprland = await Service.import("hyprland");

const WINDOW_NAME = "cheatsheet";

const load_keybindings_cmd = `python -OOO ${App.configDir}/scripts/keybindings.py`;
let _keybindings = Utils.exec(load_keybindings_cmd);
const keybindings = Variable(JSON.parse(_keybindings));

const monitor = Gdk.Display.get_default()?.get_primary_monitor();
const screen = Gdk.Screen.get_default();
const screenWidth = screen!.get_width();
const screenHeight = screen!.get_height();

const responsiveWidth = Math.round(screenWidth * 0.89);
const responsiveHeight = Math.round(screenHeight * 0.83);

const icons = {
    super: ""
};

const replace = {
    slash: "/",
    period: ".",
    escape: "Esc"
};

const category_icons = {
    actions: "accessibility_new",
    applications: "apps",
    windows: "select_window",
    workspaces: "overview_key",
    misc: "construction",
    tools: "build",
    fn: "keyboard",
};

const CATEGORIES_PER_PAGE = 6;
const currentPage = Variable(0);

const createKeyRow = (command, description) => {
    const _command = command.replaceAll(" ", " + ");
    const key_list = _command.split(" ");
    const key_box = Widget.Box({
        class_name: "row",
        css: 'box-shadow: none; border: none;',
    });

    for (const key of key_list) {
        if (key == "+")
            key_box.pack_start(
                Widget.Label({
                    label: "+",
                    class_name: "plus",
                    hpack: "start",
                    vpack: "center"
                }),
                false,
                false,
                0
            );
        else if (icons[key])
            key_box.pack_start(
                Widget.Label({
                    label: icons[key],
                    class_name: "awesome_icon key",
                    hpack: "start",
                    vpack: "center"
                }),
                false,
                false,
                0
            );
        else
            key_box.pack_start(
                Widget.Label({
                    label: replace[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1),
                    class_name: "key",
                    hpack: "start",
                    vpack: "center"
                }),
                false,
                false,
                0
            );
    }

    key_box.pack_start(
        Widget.Label({
            label: `: `,
            class_name: "separator",
            hpack: "start",
            vpack: "center"
        }),
        false,
        false,
        0
    );

    key_box.pack_start(
        Widget.Label({
            label: description,
            class_name: "description",
            hpack: "start",
            vpack: "center"
        }),
        false,
        false,
        0
    );

    return key_box;
};

const createCategoryContent = (category, commands) => {
    const container = Widget.Box({
        class_name: "category",
        vertical: true,
        hexpand: true,
        css: 'box-shadow: none; border: none;',
    });

    for (const command in commands) {
        container.pack_start(
            createKeyRow(command, commands[command]),
            false,
            false,
            0
        );
    }

    return container;
};

const createCategoryBox = (category, commands) => {
    return Widget.Box({
        class_name: "category",
        vertical: true,
        hexpand: true,
        children: [
            Widget.Box({
                css: 'box-shadow: none; border: none;',
                class_name: "category-header",
                children: [
                    MaterialIcon(category_icons[category.toLowerCase()] || "category"),
                    Widget.Label({
                        label: category,
                        class_name: "title",
                        hpack: "start"
                    })
                ]
            }),
            Widget.Separator(),
            createCategoryContent(category, commands)
        ]
    });
};

const PageContent = () => {
    const COLUMNS = 2;
    const ROWS = 3;

    const container = Widget.Box({
        class_name: "content-wrapper",
        vertical: true,
        children: [
            Widget.Box({
                class_name: "category-container",
                vertical: true,
                setup: (self) => {
                    const rows = Array.from({ length: ROWS }, () => 
                        Widget.Box({
                            class_name: "category-row",
                            hexpand: true,
                            homogeneous: true,
                            spacing: 12,
                            vexpand: true
                        })
                    );

                    function updateCategories() {
                        // Safely clear existing content
                        rows.forEach(row => {
                            row.get_children().forEach(child => child.destroy());
                            row.children = [];
                        });

                        const allCategories = Object.keys(keybindings.value);
                        const totalPages = Math.ceil(allCategories.length / CATEGORIES_PER_PAGE);
                        
                        // Validate page boundaries
                        currentPage.value = Math.max(0, Math.min(currentPage.value, totalPages - 1));
                        
                        const startIdx = currentPage.value * CATEGORIES_PER_PAGE;
                        const endIdx = Math.min(startIdx + CATEGORIES_PER_PAGE, allCategories.length);

                        // Populate new content
                        for (let i = startIdx; i < endIdx; i++) {
                            const category = allCategories[i];
                            const rowIndex = Math.floor((i - startIdx) / COLUMNS);
                            
                            if (rowIndex < ROWS) {
                                const categoryBox = createCategoryBox(category, keybindings.value[category]);
                                rows[rowIndex].pack_start(categoryBox, true, true, 0);
                            }
                        }
                    }

                    currentPage.connect("changed", () => {
                        updateCategories();
                        self.show_all();
                    });

                    updateCategories(); // Initial load
                    
                    self.pack_start(Widget.Box({ vertical: true, children: rows }), true, true, 0);
                }
            }),
            PaginationControls()
        ]
    });

    return container;
};

const PaginationControls = () => {
    const totalPages = currentPage.bind().transform(p => 
        Math.ceil(Object.keys(keybindings.value).length / CATEGORIES_PER_PAGE)
    );

    return Widget.Box({
        class_name: "pagination-controls",
        hpack: "center",
        spacing: 20,
        hexpand: true,
        children: [
            Widget.Button({
                label: "Previous",
                sensitive: currentPage.bind().transform(p => p > 0),
                class_name: "pagination-button-prev",
                on_clicked: () => currentPage.value--
            }),
            Widget.Label({
                label: currentPage.bind().transform(p => {
                    const total = Math.ceil(Object.keys(keybindings.value).length / CATEGORIES_PER_PAGE);
                    return `Page ${Math.min(p + 1, total)} of ${total}`;
                }),
            }),
            Widget.Button({
                label: "Next",
                sensitive: currentPage.bind().transform(p => 
                    p < Math.ceil(Object.keys(keybindings.value).length / CATEGORIES_PER_PAGE) - 1
                ),
                class_name: "pagination-button-next",
                on_clicked: () => currentPage.value++
            })
        ]
    });
};

export const cheatsheet = popupwindow({
    name: WINDOW_NAME,
    class_name: "cheatsheet-window",
    visible: false,
    keymode: "exclusive",
    child: Widget.Box({
        class_name: "cheatsheet-window2",
        widthRequest: responsiveWidth,
        heightRequest: responsiveHeight,
        child: PageContent()
    }),
    anchor: [],
    setup: (win) => {
        win.set_default_size(responsiveWidth + 20, responsiveHeight);
    }
});
