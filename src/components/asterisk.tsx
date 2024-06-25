export function Asterisk({ show = true }: { show?: boolean }) {
  if (!show) {
    return null;
  }

  return <span className="text-red-500">*</span>;
}
