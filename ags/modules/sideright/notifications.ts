// by koeqaife ;)

import { Notification as NotificationType } from "types/service/notifications";
import { NotificationPopups, Notification } from "modules/notificationPopups";
import Box from "types/widgets/box";

const notifications = await Service.import("notifications");

type NotificationsBoxType = {
    exclude?: string[];
    include?: string[];
};

const NotificationReveal = (notification: NotificationType, visible = false, dismiss = true) => {
    const transition_duration = 200;
    const secondRevealer = Widget.Revealer({
        vpack: "center",
        //hpack: "center",
        child: Notification(notification, dismiss),
        reveal_child: visible,
        transition: "crossfade",
        transition_duration: transition_duration,
        hexpand: true,
        class_name: "second_revealer",
        setup: (revealer) => {
            Utils.timeout(1, () => {
                revealer.reveal_child = true;
            });
        }
    });

    const firstRevealer = Widget.Revealer({
        child: secondRevealer,
        reveal_child: true,
        transition: "slide_down",
        transition_duration: transition_duration,
        class_name: "first_revealer"
    });

    type BoxAttrs = {
        destroyWithAnims: any;
        count: number;
        id: number;
        app: string;
        destroying: boolean;
    };

    let box: Box<any, BoxAttrs>;

    const destroyWithAnims = () => {
        if (box.attribute.destroying) return;
        box.attribute.destroying = true;
        secondRevealer.reveal_child = false;
        Utils.timeout(transition_duration, () => {
            firstRevealer.reveal_child = false;
            Utils.timeout(transition_duration, () => {
                box.destroy();
            });
        });
    };
    box = Widget.Box({
        hexpand: true,
        attribute: {
            destroyWithAnims: destroyWithAnims,
            count: 0,
            id: notification.id,
            app: notification.app_name,
            destroying: false
        },
        children: [firstRevealer]
    });
    return box;
};

export function NotificationsBox({ exclude = [], include = [] }: NotificationsBoxType) {
    const popups = NotificationPopups(false, { exclude: exclude, include: include }, false, NotificationReveal);

    const menu = Widget.Menu({
        class_name: "notifications_menu",
        children: [
            Widget.MenuItem({
                child: Widget.Label({
                    label: "Close all",
                    hpack: "start"
                }),
                class_name: "notifications_menu_item",
                on_activate: () => {
                    for (let n of notifications.notifications) {
                        if (n) {
                            n.dismiss();
                            n.close();
                        }
                    }
                }
            })
        ]
    });

    return Widget.EventBox({
        vexpand: true,
        hexpand: true,
        on_secondary_click_release: (_, event) => {
            menu.popup_at_pointer(event);
        },
        child: Widget.Scrollable({
            class_name: "notifications_sidebar_scrollable",
            hscroll: "never",
            child: Widget.Box({
                vertical: true,
                children: [
                    popups,
                    Widget.Revealer({
                        child: Widget.Label({
                            label: "No notifications",
                            class_name: "no_notifications"
                        }),
                        reveal_child: true,
                        transition: "slide_down"
                    })
                ],
                setup: (self) => {
                    popups.connect("notify::children", () => {
                        type RevealerType = ReturnType<typeof Widget.Revealer>;
                        (self.children[1] as RevealerType).reveal_child = popups.children.length == 0;
                    });
                }
            }),
            hexpand: true
        })
    });
}
