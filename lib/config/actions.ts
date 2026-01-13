/**
 * Game Actions - All available actions grouped by entity
 */

import type { ActionPool } from "@/lib/types/game";

export const ACTIONS: ActionPool = {
  Government: [
    {
      name: "Tăng thuế Doanh nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_thue_dn_qjctbv.png",
      effects: { Government: 12, Businesses: -12, Workers: -5 },
    },
    {
      name: "Giảm thuế Doanh nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_thue_dn_r46w9t.png",
      effects: { Government: -12, Businesses: 8, Workers: 2 },
    },
    {
      name: "Tăng thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_thue_tncn_gpf941.png",
      effects: { Government: 12, Businesses: -3, Workers: -7 },
    },
    {
      name: "Giảm thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_thue_tncn_lvyqvl.png",
      effects: { Government: -11, Businesses: 2, Workers: 7 },
    },
    {
      name: "Đầu tư cơ sở hạ tầng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_ht_d8hcpe.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Đầu tư vào Giáo dục",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_gd_j0rgaw.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Trợ cấp an sinh xã hội",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tro_cap_asxh_adk225.png",
      effects: { Government: -12, Businesses: 3, Workers: 7 },
    },
    {
      name: "Trợ cấp thất nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tro_cap_tn_d6vxxg.png",
      effects: { Government: -9, Businesses: 0, Workers: 3 },
    },
    {
      name: "Tăng mức lương tối thiểu",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_luong_toi_thieu_z3fgki.png",
      effects: { Government: 2, Businesses: -13, Workers: 7 },
    },
    {
      name: "Siết chặt quy định kinh doanh",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/siet_chat_qddn_djxwjf.png",
      effects: { Government: 10, Businesses: -12, Workers: -5 },
    },
    {
      name: "Khuyến khích Startup",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/kk_startup_dy9rps.png",
      effects: { Government: -12, Businesses: 3, Workers: 6 },
    },
    {
      name: "Kích cầu kinh tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/kich_cau_kt_bjjsxm.png",
      effects: { Government: -16, Businesses: 12, Workers: 6 },
    },
    {
      name: "Mở rộng hợp tác quốc tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/hop_tac_qt_o72rt0.png",
      effects: { Government: 3, Businesses: 3, Workers: 3 },
    },
    {
      name: "Ra soát tham nhũng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/ra_soat_tn_kyq2gv.png",
      effects: { Government: 6, Businesses: -9, Workers: 3 },
    },
    {
      name: "Siết chặt hàng giả - gian lận",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/siet_chat_hg_gl_boprov.png",
      effects: { Government: 6, Businesses: -10, Workers: 3 },
    },
  ],
  Businesses: [
    {
      name: "Ép buộc tăng ca",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_ca_xwhnje.png",
      effects: { Government: 3, Businesses: 10, Workers: -11 },
    },
    {
      name: "Cắt giảm nhân sự",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/cat_giam_ns_nbwqn3.png",
      effects: { Government: -6, Businesses: 12, Workers: -11 },
    },
    {
      name: "Đầu tư công nghệ mới",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_cn_fxlows.png",
      effects: { Government: 6, Businesses: 4, Workers: 3 },
    },
    {
      name: "Trốn thuế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tron_thue_dqogzd.png",
      effects: { Government: -11, Businesses: 7, Workers: -9 },
    },
    {
      name: "Tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_luong_jxdd8a.png",
      effects: { Government: 2, Businesses: -6, Workers: 7 },
    },
    {
      name: "Mở rộng sản xuất",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/mo_rong_sx_egazs0.png",
      effects: { Government: 2, Businesses: 6, Workers: 4 },
    },
    {
      name: "Hối lộ quan chức",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/hoi_lo_ddjb9q.png",
      effects: { Government: -12, Businesses: 6, Workers: -7 },
    },
    {
      name: "Xả thải ra môi trường",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/xa_thai_s1myf9.png",
      effects: { Government: -13, Businesses: 6, Workers: -7 },
    },
    {
      name: "Tăng giá bán sản phẩm",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_gia_fgodwi.png",
      effects: { Government: 2, Businesses: 5, Workers: -9 },
    },
    {
      name: "Sản xuất hàng giả",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/sx_hang_gia_l0jguv.png",
      effects: { Government: -12, Businesses: 6, Workers: -10 },
    },
    {
      name: "Chạy đua giảm giá",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_gia_poze84.png",
      effects: { Government: -1, Businesses: 4, Workers: -7 },
    },
    {
      name: "Đào tạo lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dao_tao_ld_dh3ikr.png",
      effects: { Government: 2, Businesses: 3, Workers: 5 },
    },
  ],
  Workers: [
    {
      name: "Nâng cao tay nghề",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nang_cao_tay_nghe_yvmflt.png",
      effects: { Government: 4, Businesses: 3, Workers: 5 },
    },
    {
      name: "Nhảy việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nhay_viec_zgaopd.png",
      effects: { Government: -1, Businesses: -10, Workers: 3 },
    },
    {
      name: "Gian lận trong lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/vi_pham_ursnk4.png",
      effects: { Government: -3, Businesses: -9, Workers: 2 },
    },
    {
      name: "Nghỉ việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nghi_viec_wssckn.png",
      effects: { Government: -6, Businesses: -8, Workers: -4 },
    },
    {
      name: "Tự nguyện làm thêm giờ",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_ca_tn_qbacqf.png",
      effects: { Government: 5, Businesses: 4, Workers: 2 },
    },
    {
      name: "Làm thêm nhiều việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/lam_nhieu_viec_gy1mrh.png",
      effects: { Government: 5, Businesses: 2, Workers: 4 },
    },
    {
      name: "Đình công",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dinh_cong_ii5mpu.png",
      effects: { Government: -13, Businesses: -11, Workers: -9 },
    },
    {
      name: "Biểu tình đòi tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/bieu_tinh_mt4oqi.png",
      effects: { Government: -11, Businesses: -12, Workers: -8 },
    },
    {
      name: "Làm việc hăng hái",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/lam_viec_hang_hai_rugops.png",
      effects: { Government: 3, Businesses: 5, Workers: 3 },
    },
  ],
};
