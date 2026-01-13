import React from "react";

interface FAQPopupProps {
  onClose: () => void;
}

export default function FAQPopup({ onClose }: FAQPopupProps) {
  return (
    <div
      className="faq-popup mobile-faq-popup absolute left-0 mt-2 top-16 ml-2 z-[100] bg-white rounded-xl shadow-xl border border-yellow-400 p-6 w-80 animate-fadeIn"
      style={{ minWidth: 260 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className=" text-yellow-700 text-lg">Hướng dẫn</span>
        <button
          className="text-slate-500 hover:text-red-500 text-xl font-bold px-2"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
      <div className="text-slate-500 text-[16px] leading-relaxed">
        <ul className="list-disc pl-5">
          <li className="text-yellow-500">
            Lựa chọn các &apos;hành động&apos; khôn ngoan để duy trì 3 thanh trạng thái
            cân bằng trong 30 vòng để chiến thắng.
          </li>
          <li className="text-red-400">Thất bại : 1 trong 3 chỉ số về 0.</li>
          <li>N : Nhà nước</li>
          <li>D : Doanh Nghiệp</li>
          <li>L : Người lao động</li>
          <li className="text-purple-600">
            Các sự kiện đặc biệt sẽ xuất hiện ở một số vòng.
          </li>
          <li className="text-slate-400 text-[14px] leading-relaxed list-none text-center mt-2 font-bold">
            góp ý / báo lỗi : tqdat410@gmail.com
          </li>
        </ul>
      </div>
    </div>
  );
}
