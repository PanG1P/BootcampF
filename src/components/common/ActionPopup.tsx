"use client";

type ActionPopupProps = {
  // เปิด / ปิด popup
  open: boolean;

  // ประเภท popup:
  // - success = สำเร็จ
  // - error = ไม่สำเร็จ
  // - confirm = ถามยืนยันก่อนทำรายการ
  type: "success" | "error" | "confirm";

  // หัวข้อหลักของ popup
  title: string;

  // ข้อความอธิบายเพิ่มเติม
  message: string;

  // ปิด popup
  onClose: () => void;

  // ใช้เฉพาะ popup แบบ confirm
  onConfirm?: () => void;

  // ข้อความปุ่ม confirm แบบกำหนดเองได้
  confirmText?: string;

  // ข้อความปุ่ม cancel แบบกำหนดเองได้
  cancelText?: string;
};

export default function ActionPopup({
  open,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
}: ActionPopupProps) {
  // ถ้าไม่เปิด popup ก็ไม่ต้อง render อะไรเลย
  if (!open) return null;

  // กำหนดสีตามประเภท popup
  const titleColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : "text-slate-800";

  const confirmButtonClass =
    type === "error"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-slate-900 hover:bg-slate-800";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      {/* กล่อง popup */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className={`text-xl font-bold ${titleColor}`}>{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        </div>

        {/* ถ้าเป็น confirm จะแสดง 2 ปุ่ม */}
        {type === "confirm" ? (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          // success / error ใช้ปุ่มเดียว
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              ตกลง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}