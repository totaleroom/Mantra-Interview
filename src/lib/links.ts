// WhatsApp support link — kept for user support CTA
const _w = ["NjI4MjEyNTA4NjMyOA=="];
const _m = [
  "SGFpIE1hbnRyYVNraWxsISBTYXlhIGJ1dHVoIGJhbnR1YW4u",
];

export const getWaUrl = () => {
  const msg = encodeURIComponent(atob(_m.join("")));
  return `https://wa.me/${atob(_w[0])}?text=${msg}`;
};

export const openWhatsApp = (e?: React.MouseEvent) => {
  e?.preventDefault();
  window.open(getWaUrl(), "_blank", "noopener,noreferrer");
};
