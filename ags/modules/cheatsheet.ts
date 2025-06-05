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
    // Simple approach: recreate the entire stack content on page change
    // This avoids complex GTK container manipulation
    
    const stackWidget = Widget.Stack({
        class_name: "category-stack",
        transition_type: Gtk.StackTransitionType.SLIDE_LEFT_RIGHT,
        transition_duration: 300,
        children: {
            "current": createCategoryContainer()
        },
        shown: "current"
    });

    const container = Widget.Box({
        class_name: "content-wrapper",
        vertical: true,
        children: [
            stackWidget,
            PaginationControls()
        ]
    });

    // Handle page changes by recreating stack content
    let isAnimating = false;
    let lastPage = 0;
    
    currentPage.connect("changed", () => {
        if (isAnimating) return;
        isAnimating = true;
        
        const direction = currentPage.value - lastPage;
        lastPage = currentPage.value;
        
        // Set transition direction
        if (direction > 0) {
            stackWidget.transition_type = Gtk.StackTransitionType.SLIDE_LEFT;
        } else if (direction < 0) {
            stackWidget.transition_type = Gtk.StackTransitionType.SLIDE_RIGHT;
        } else {
            stackWidget.transition_type = Gtk.StackTransitionType.CROSSFADE;
        }
        
        // Create new content with updated page data
        const newContent = createCategoryContainer();
        const newPageName = `page-${Date.now()}`;
        
        // Add new page and transition to it
        stackWidget.add_named(newContent, newPageName);
        stackWidget.set_visible_child_name(newPageName);
        
        // Clean up old page after transition
        Utils.timeout(350, () => {
            // Remove the old "current" page if it exists
            const oldChild = stackWidget.get_child_by_name("current");
            if (oldChild) {
                stackWidget.remove(oldChild);
            }
            
            // Rename the new page to "current" for next iteration
            // Note: GTK doesn't provide a rename method, so we'll use the timestamp approach
            isAnimating = false;
        });
    });

    return container;
};

// Alternative even simpler approach - just recreate the entire content
/*const PageContentSimple = () => {
    const contentBox = Widget.Box({
        class_name: "category-container-wrapper",
        child: createCategoryContainer()
    });

    const container = Widget.Box({
        class_name: "content-wrapper",
        vertical: true,
        children: [
            contentBox,
            PaginationControls()
        ]
    });

    // Handle page changes by replacing content with fade effect
    currentPage.connect("changed", () => {
        // Add fade out effect
        contentBox.css = `
            opacity: 0;
            transition: opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
        `;
        
        // Replace content after fade out
        Utils.timeout(150, () => {
            contentBox.child = createCategoryContainer();
            
            // Fade back in
            contentBox.css = `
                opacity: 1;
                transition: opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            `;
        });
    });

    return container;
};

// Use the simple approach to avoid GTK Stack complexity
const PageContent = PageContentSimple;*/

// Create category container with enhanced animations
const createCategoryContainer = () => {
    const rows = Array.from({ length: 3 }, () => 
        Widget.Box({
            class_name: "category-row",
            hexpand: true,
            homogeneous: true,
            spacing: 12,
            vexpand: true
        })
    );

    const allCategories = Object.keys(keybindings.value);
    const startIdx = currentPage.value * CATEGORIES_PER_PAGE;
    const endIdx = Math.min(startIdx + CATEGORIES_PER_PAGE, allCategories.length);

    // Add staggered entrance animations
    for (let i = startIdx; i < endIdx; i++) {
        const category = allCategories[i];
        const rowIndex = Math.floor((i - startIdx) / 2);
        
        if (rowIndex < 3) {
            const categoryBox = createAnimatedCategoryBox(category, keybindings.value[category], i - startIdx);
            rows[rowIndex].pack_start(categoryBox, true, true, 0);
        }
    }

    return Widget.Box({
        class_name: "category-container",
        vertical: true,
        children: [Widget.Box({ vertical: true, children: rows })]
    });
};

// Enhanced category box with entrance animations
const createAnimatedCategoryBox = (category: string, commands: Record<string, string>, index: number) => {
    const box = Widget.Box({
        class_name: "category animated-category",
        vertical: true,
        hexpand: true,
        css: `
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            margin-top: 20px;
        `,
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

    // Staggered entrance animation
    Utils.timeout(50 + (index * 100), () => {
        box.css = `
            opacity: 1;
            transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
            margin-top: 0px;
        `;
    });

    return box;
};

// Enhanced pagination with button animations
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
                class_name: "pagination-button-prev material-button",
                css: `
                    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
                `,
                on_clicked: (self) => {
                    // Button press animation
                    self.css = `
                        transition: all 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
                    `;
                    Utils.timeout(100, () => {
                        self.css = `
                            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
                        `;
                    });
                    currentPage.value--;
                }
            }),
            Widget.Label({
                label: currentPage.bind().transform(p => {
                    const total = Math.ceil(Object.keys(keybindings.value).length / CATEGORIES_PER_PAGE);
                    return `Page ${Math.min(p + 1, total)} of ${total}`;
                }),
                class_name: "page-indicator",
                css: `
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                `
            }),
            Widget.Button({
                label: "Next",
                sensitive: currentPage.bind().transform(p => 
                    p < Math.ceil(Object.keys(keybindings.value).length / CATEGORIES_PER_PAGE) - 1
                ),
                class_name: "pagination-button-next material-button",
                css: `
                    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
                `,
                on_clicked: (self) => {
                    // Button press animation
                    self.css = `
                        transition: all 0.1s cubic-bezier(0.4, 0.0, 0.2, 1);
                    `;
                    Utils.timeout(100, () => {
                        self.css = `
                            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
                        `;
                    });
                    currentPage.value++;
                }
            })
        ]
    });
};

// Alternative: Custom slide animation using revealer
const createCustomSlideTransition = () => {
    const leftRevealer = Widget.Revealer({
        transition_type: Gtk.RevealerTransitionType.SLIDE_LEFT,
        transition_duration: 300,
        reveal_child: false
    });
    
    const rightRevealer = Widget.Revealer({
        transition_type: Gtk.RevealerTransitionType.SLIDE_RIGHT,
        transition_duration: 300,
        reveal_child: true
    });
    
    return Widget.Overlay({
        child: rightRevealer,
        overlays: [leftRevealer],
        setup: (self) => {
            // Custom transition logic
            currentPage.connect("changed", () => {
                // Hide current, show new with slide effect
                rightRevealer.reveal_child = false;
                Utils.timeout(150, () => {
                    // Update content here
                    rightRevealer.reveal_child = true;
                });
            });
        }
    });
};

// CSS animations for enhanced effects
const materialAnimationCSS = `
/* Material 3 Animation Variables */
:root {
    --md-sys-motion-duration-short1: 50ms;
    --md-sys-motion-duration-short2: 100ms;
    --md-sys-motion-duration-short3: 150ms;
    --md-sys-motion-duration-short4: 200ms;
    --md-sys-motion-duration-medium1: 250ms;
    --md-sys-motion-duration-medium2: 300ms;
    --md-sys-motion-duration-medium3: 350ms;
    --md-sys-motion-duration-medium4: 400ms;
    --md-sys-motion-duration-long1: 450ms;
    --md-sys-motion-duration-long2: 500ms;
    --md-sys-motion-duration-long3: 550ms;
    --md-sys-motion-duration-long4: 600ms;
    
    --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
    --md-sys-motion-easing-standard-decelerate: cubic-bezier(0.0, 0.0, 0, 1.0);
    --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0.0, 1.0, 1.0);
    --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0, 1.0);
    --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
    --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);
}

.animated-category {
    transition: all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
}

.material-button {
    transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.material-button:hover {
    transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.page-slide-enter {
    margin-left: 100%;
    opacity: 0;
}

.page-slide-enter-active {
    margin-left: 0;
    margin-right: 0;
    opacity: 1;
    transition: all var(--md-sys-motion-duration-medium3) var(--md-sys-motion-easing-emphasized-decelerate);
}

.page-slide-exit {
    margin-left: 0;
    margin-right: 0;
    opacity: 1;
}

.page-slide-exit-active {
    margin-left: 0;
    margin-right: 100%;
    opacity: 0;
    transition: all var(--md-sys-motion-duration-medium3) var(--md-sys-motion-easing-emphasized-accelerate);
}
`;

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
