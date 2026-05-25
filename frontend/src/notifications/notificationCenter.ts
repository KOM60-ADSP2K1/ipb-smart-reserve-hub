import { apiRequest } from "../api/http";

export type NotificationRole = "staff" | "student" | "super_admin";

export type NotificationTarget = {
  reservation_id: string | null;
  route: string;
  type: string;
};

export type NotificationItem = {
  category: string;
  created_at: string;
  id: string;
  message: string;
  read_at: string | null;
  reservation_id: string | null;
  target: NotificationTarget | null;
  title: string;
};

export const roleLanding: Record<NotificationRole, string> = {
  staff: "/staff",
  student: "/student",
  super_admin: "/super-admin",
};

const roleNotificationPage: Record<NotificationRole, string> = {
  staff: "/staff/notifications",
  student: "/student/notifications",
  super_admin: "/super-admin/notifications",
};

const supportedRoutePatterns: Record<NotificationRole, RegExp[]> = {
  staff: [
    /^\/staff$/,
    /^\/staff\/facilities(?:\/[^/]+)?$/,
    /^\/staff\/reservations(?:\/[^/]+(?:\/review-decision)?)?$/,
    /^\/staff\/notifications$/,
  ],
  student: [
    /^\/student$/,
    /^\/student\/facilities(?:\/[^/]+(?:\/reserve\/(?:time|details))?)?$/,
    /^\/student\/reservations(?:\/[^/]+(?:\/(?:letter|payment(?:\/(?:waiting|declined))?|accepted|verification\/(?:waiting|declined)|review|cancellation(?:-request)?))?)?$/,
    /^\/student\/notifications$/,
    /^\/student\/profile$/,
  ],
  super_admin: [
    /^\/super-admin$/,
    /^\/super-admin\/facilities(?:\/[^/]+)?$/,
    /^\/super-admin\/reports(?:\/logs)?$/,
    /^\/super-admin\/system$/,
    /^\/super-admin\/users$/,
    /^\/super-admin\/notifications$/,
    /^\/super-admin\/profile$/,
  ],
};

export function fetchNotifications(params?: { limit?: number; offset?: number }) {
  const search = new URLSearchParams();
  if (params?.limit !== undefined) {
    search.set("limit", String(params.limit));
  }
  if (params?.offset !== undefined && params.offset > 0) {
    search.set("offset", String(params.offset));
  }
  const query = search.toString();
  return apiRequest<NotificationItem[]>(`/notifications${query ? `?${query}` : ""}`);
}

export function fetchUnreadNotificationCount() {
  return apiRequest<{ unread_count: number }>("/notifications/unread-count");
}

export function markNotificationRead(notificationId: string) {
  return apiRequest<NotificationItem>(`/notifications/${notificationId}/read`, { method: "POST" });
}

export function markAllNotificationsRead() {
  return apiRequest<NotificationItem[]>("/notifications/read-all", { method: "POST" });
}

function fillRouteTemplate(route: string, reservationId: string | null) {
  if (!reservationId) {
    return route;
  }

  return route.replace("{reservation_id}", encodeURIComponent(reservationId));
}

function isSupportedRoleRoute(route: string, role: NotificationRole) {
  return supportedRoutePatterns[role].some((pattern) => pattern.test(route));
}

export function resolveNotificationHref(notification: NotificationItem, role: NotificationRole) {
  const route = notification.target?.route
    ? fillRouteTemplate(notification.target.route, notification.target.reservation_id ?? notification.reservation_id)
    : null;

  if (route && isSupportedRoleRoute(route, role)) {
    return route;
  }

  return roleLanding[role];
}

export function notificationListingHref(role: NotificationRole) {
  return roleNotificationPage[role];
}

export function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function formatNotificationDateHeading(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function categoryLabel(category: string) {
  if (category === "reservation") {
    return "Reservasi";
  }

  return "Sistem";
}

export function groupNotificationsByDate(notifications: NotificationItem[]) {
  const groups: Array<{ date: string; items: NotificationItem[]; label: string }> = [];

  for (const notification of notifications) {
    const date = notification.created_at.slice(0, 10);
    const existingGroup = groups[groups.length - 1];

    if (existingGroup?.date === date) {
      existingGroup.items.push(notification);
      continue;
    }

    groups.push({
      date,
      items: [notification],
      label: formatNotificationDateHeading(notification.created_at),
    });
  }

  return groups;
}
