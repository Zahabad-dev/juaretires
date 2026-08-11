const DEFAULT_NUMBER = "5217751339513";

export function whatsappLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
