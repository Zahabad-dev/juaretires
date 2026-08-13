self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "JAURE CRM", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Nuevo lead asignado";
  const options = {
    body: data.body || "Tienes una solicitud nueva en el CRM.",
    icon: "/brand/jj-isotipo.png",
    badge: "/brand/jj-isotipo.png",
    data: { url: data.url || "/crm/solicitudes" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/crm/solicitudes";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
