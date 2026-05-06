// Encoded link segments — tidak terlihat langsung sebagai satu string utuh
const _c = [
  "aHR0cHM6Ly9seW5r",
  "LmlkL21hbnRyYXNr",
  "aWxsL25xOG5sNm5r",
  "MTRwbC9jaGVja291dA==",
];
const _w = ["NjI4MjEyNTA4NjMyOA=="];
const _m = [
  "SGFpIE1hbnRyYVNraWxsISBTYXlhIHRlcnRhcmlrIGRlbmdhbiBwcm9ncmFtIFNwcmlu",
  "dCA3IEhhcmkuIEJpc2EgaW5mbyBsZWJpaCBsYW5qdXQ/",
];

export const getCheckoutUrl = () => atob(_c.join(""));
export const getWaUrl = () => {
  const msg = encodeURIComponent(atob(_m.join("")));
  return `https://wa.me/${atob(_w[0])}?text=${msg}`;
};

export const openCheckout = (e?: React.MouseEvent) => {
  e?.preventDefault();
  window.open(getCheckoutUrl(), "_blank", "noopener,noreferrer");
};
export const openWhatsApp = (e?: React.MouseEvent) => {
  e?.preventDefault();
  window.open(getWaUrl(), "_blank", "noopener,noreferrer");
};
