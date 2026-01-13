import { ActionPool } from "../types/game";

const CLOUDINARY_BASE = "https://res.cloudinary.com/do6szo7zy/image/upload";
const OPT_ACTION = "f_auto,q_auto,ar_9:16,c_fill"; // 9:16 for Actions

export const ACTIONS: ActionPool = {
  Government: [
    {
      name: "Tăng thuế Doanh nghiệp",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308248/cp_tang-thue_igzq5p.png`,
      effects: { Government: 12, Businesses: -12, Workers: -5 },
    },
    {
      name: "Giảm thuế Doanh nghiệp",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308255/cp_giam-thue_quogcg.png`,
      effects: { Government: -12, Businesses: 8, Workers: 2 },
    },
    {
      name: "Tăng thuế TNCN",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308249/cp_tang-thue-tncn_hbh9js.png`,
      effects: { Government: 12, Businesses: -3, Workers: -7 },
    },
    {
      name: "Giảm thuế TNCN",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308246/cp_giam-thue-tncn_ichkdb.png`,
      effects: { Government: -11, Businesses: 2, Workers: 7 },
    },
    {
      name: "Đầu tư cơ sở hạ tầng",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308245/cp_csht_gxgnsq.png`,
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Đầu tư vào Giáo dục",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308255/cp_dtgd_otooff.png`,
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Trợ cấp an sinh xã hội",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308254/cp_asxh_gic5ob.png`,
      effects: { Government: -12, Businesses: 3, Workers: 7 },
    },
    {
      name: "Trợ cấp thất nghiệp",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308250/cp_tctn_vnvnwo.png`,
      effects: { Government: -9, Businesses: 0, Workers: 3 },
    },
    {
      name: "Tăng mức lương tối thiểu",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308251/cp_tmltt_ryteue.png`,
      effects: { Government: 2, Businesses: -13, Workers: 7 },
    },
    {
      name: "Siết chặt quy định kinh doanh",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308248/cp_scqdkd_gtcupd.png`,
      effects: { Government: 10, Businesses: -12, Workers: -5 },
    },
    {
      name: "Khuyến khích Startup",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308245/cp_kkkn_zdqgol.png`,
      effects: { Government: -12, Businesses: 3, Workers: 6 },
    },
    {
      name: "Kích cầu kinh tế",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308255/cp_kckt_gvcl5p.png`,
      effects: { Government: -16, Businesses: 12, Workers: 6 },
    },
    {
      name: "Mở rộng hợp tác quốc tế",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308247/cp_htqt_hptyp5.png`,
      effects: { Government: 3, Businesses: 3, Workers: 3 },
    },
    {
      name: "Ra soát tham nhũng",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308246/cp_rstn_lfywvo.png`,
      effects: { Government: 6, Businesses: -9, Workers: 3 },
    },
    {
      name: "Siết chặt hàng giả - gian lận",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308247/cp_schg_tqvexe.png`,
      effects: { Government: 6, Businesses: -10, Workers: 3 },
    },
  ],
  Businesses: [
    {
      name: "Ép buộc tăng ca",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308258/dn_tang-ca_tx5pbx.png`,
      effects: { Government: 3, Businesses: 10, Workers: -11 },
    },
    {
      name: "Cắt giảm nhân sự",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308254/dn_cat-giam_ta4qfc.png`,
      effects: { Government: -6, Businesses: 12, Workers: -11 },
    },
    {
      name: "Đầu tư công nghệ mới",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308259/dn_dtcn_j2oeea.png`,
      effects: { Government: 6, Businesses: 4, Workers: 3 },
    },
    {
      name: "Trốn thuế",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308258/dn_tron-thue_qyrt6c.png`,
      effects: { Government: -11, Businesses: 7, Workers: -9 },
    },
    {
      name: "Tăng lương",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308257/dn_tang-luong_eto6mi.png`,
      effects: { Government: 2, Businesses: -6, Workers: 7 },
    },
    {
      name: "Mở rộng sản xuất",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308256/dn_mrsx_hol4pu.png`,
      effects: { Government: 2, Businesses: 6, Workers: 4 },
    },
    {
      name: "Hối lộ quan chức",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308261/dn_hoi-lo_lfrnee.png`,
      effects: { Government: -12, Businesses: 6, Workers: -7 },
    },
    {
      name: "Xả thải ra môi trường",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308259/dn_xa-thai_aj4zln.png`,
      effects: { Government: -13, Businesses: 6, Workers: -7 },
    },
    {
      name: "Tăng giá bán sản phẩm",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308257/dn_tang-gia_bagn0o.png`,
      effects: { Government: 2, Businesses: 5, Workers: -9 },
    },
    {
      name: "Sản xuất hàng giả",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308260/dn_sxhg_bq2mgk.png`,
      effects: { Government: -12, Businesses: 6, Workers: -10 },
    },
    {
      name: "Chạy đua giảm giá",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308256/dn_giam-gia_vjrzal.png`,
      effects: { Government: -1, Businesses: 4, Workers: -7 },
    },
    {
      name: "Đào tạo lao động",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308255/dn_dao-tao_p9hxxw.png`,
      effects: { Government: 2, Businesses: 3, Workers: 5 },
    },
  ],
  Workers: [
    {
      name: "Nâng cao tay nghề",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308266/ld_nctn_fivmsz.png`,
      effects: { Government: 4, Businesses: 3, Workers: 5 },
    },
    {
      name: "Nhảy việc",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308266/ld_nhay-viec_je0eub.png`,
      effects: { Government: -1, Businesses: -10, Workers: 3 },
    },
    {
      name: "Gian lận trong lao động",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308262/ld_gian-lan_u21wqs.png`,
      effects: { Government: -3, Businesses: -9, Workers: 2 },
    },
    {
      name: "Nghỉ việc",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308260/ld_nghi-viec_wmaolx.png`,
      effects: { Government: -6, Businesses: -8, Workers: -4 },
    },
    {
      name: "Tự nguyện làm thêm giờ",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308262/ld_tang-ca_pckv0z.png`,
      effects: { Government: 5, Businesses: 4, Workers: 2 },
    },
    {
      name: "Làm thêm nhiều việc",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308262/ld_nhieu-viec_nsxwpw.png`,
      effects: { Government: 5, Businesses: 2, Workers: 4 },
    },
    {
      name: "Đình công",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308259/ld_dinh-cong_uqanjp.png`,
      effects: { Government: -13, Businesses: -11, Workers: -9 },
    },
    {
      name: "Biểu tình đòi tăng lương",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308267/ld_tang-luong_mkclxe.png`,
      effects: { Government: -11, Businesses: -12, Workers: -8 },
    },
    {
      name: "Làm việc hăng hái",
      imageUrl: `${CLOUDINARY_BASE}/${OPT_ACTION}/v1768308260/ld_lvhh_b4kuqd.png`,
      effects: { Government: 3, Businesses: 5, Workers: 3 },
    },
  ],
};
