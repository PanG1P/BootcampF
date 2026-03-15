type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
    >
      {children}
    </button>
  );
}