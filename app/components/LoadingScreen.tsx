"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const ASSETS = {
  backgrounds: [
    // Local Backgrounds
    "/background/bg_menu.jpg",
    "/background/bg_failed.jpg",
    "/background/bg_survived.jpg",
    "/background/bg_harmony.jpg",
    "/background/bg_leaderboard.jpg",
    "/background/db_loading.svg",

    // Event Images (Cloudinary)
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308253/db_khoi-nghiep_g4cswk.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308254/db_thien-tai_ocv2f4.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308251/db_dau-tu_vm9m4i.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308252/db_khkt_jshyig.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308251/db_chon-phe_pncor9.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_16:9,c_fill/v1768308251/db_chien-tranh_k9mgjp.png",

    // Action Cards (Government)
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308248/cp_tang-thue_igzq5p.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308255/cp_giam-thue_quogcg.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308249/cp_tang-thue-tncn_hbh9js.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308246/cp_giam-thue-tncn_ichkdb.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308245/cp_csht_gxgnsq.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308255/cp_dtgd_otooff.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308254/cp_asxh_gic5ob.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308250/cp_tctn_vnvnwo.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308251/cp_tmltt_ryteue.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308248/cp_scqdkd_gtcupd.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308245/cp_kkkn_zdqgol.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308255/cp_kckt_gvcl5p.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308247/cp_htqt_hptyp5.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308246/cp_rstn_lfywvo.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308247/cp_schg_tqvexe.png",

    // Action Cards (Businesses)
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308258/dn_tang-ca_tx5pbx.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308254/dn_cat-giam_ta4qfc.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308259/dn_dtcn_j2oeea.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308258/dn_tron-thue_qyrt6c.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308257/dn_tang-luong_eto6mi.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308256/dn_mrsx_hol4pu.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308261/dn_hoi-lo_lfrnee.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308259/dn_xa-thai_aj4zln.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308257/dn_tang-gia_bagn0o.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308260/dn_sxhg_bq2mgk.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308256/dn_giam-gia_vjrzal.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308255/dn_dao-tao_p9hxxw.png",

    // Action Cards (Workers)
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308266/ld_nctn_fivmsz.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308266/ld_nhay-viec_je0eub.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308262/ld_gian-lan_u21wqs.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308260/ld_nghi-viec_wmaolx.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308262/ld_tang-ca_pckv0z.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308262/ld_nhieu-viec_nsxwpw.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308259/ld_dinh-cong_uqanjp.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308267/ld_tang-luong_mkclxe.png",
    "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,ar_9:16,c_fill/v1768308260/ld_lvhh_b4kuqd.png",
  ],
  fonts: ["/font/DFVN_Hogfish.otf"],
  sounds: [
    "/sound/01HSH4ZF979N7WBMDSDCHJ8D0X.mp3",
    "/sound/01HY1ACCZV6A2ZNTEV25X7KJGM.mp3",
  ],
};

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    const totalAssets =
      ASSETS.backgrounds.length +
      ASSETS.fonts.length +
      ASSETS.sounds.length;
    let loadedCount = 0;

    const updateProgress = () => {
      if (!mounted) return;
      loadedCount++;
      const newProgress = Math.min(
        100,
        Math.round((loadedCount / totalAssets) * 100)
      );
      setProgress(newProgress);
    };

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        let resolved = false;

        const handleLoad = () => {
          if (resolved) return;
          resolved = true;
          updateProgress();
          resolve();
        };

        img.onload = handleLoad;
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          handleLoad(); // Treat error as loaded to continue
        };

        img.src = src;

        if (img.complete && img.naturalHeight !== 0) {
          handleLoad();
        }
      });
    };

    const preloadAudio = (src: string) => {
      return new Promise<void>((resolve) => {
        let resolved = false;
        const audio = new Audio();
        
        const handleLoad = () => {
          if (resolved) return;
          resolved = true;
          updateProgress();
          resolve();
        };

        audio.oncanplaythrough = handleLoad;
        audio.onerror = () => {
          console.warn(`Failed to load audio: ${src}`);
          handleLoad();
        };

        audio.src = src;
        
        // Fallback timeout for audio that might not preload without interaction
        setTimeout(() => {
          if (!resolved) {
            handleLoad();
          }
        }, 2000);
      });
    };

    const preloadFont = (src: string) => {
        // Font loading is tricky, we'll assume it's loaded if the document fonts are ready or timeout
        return new Promise<void>((resolve) => {
            // Just a simple timeout or check if document.fonts is available
             // In a real scenario, we might use FontFace API, but for simplicity/robustness:
             // We just mark it as done after a short delay or rely on browser cache
             // Since Next.js handles fonts, we'll simulate a check
             setTimeout(() => {
                 updateProgress();
                 resolve();
             }, 500);
        });
    };

    const loadAll = async () => {
      const promises = [
        ...ASSETS.backgrounds.map(preloadImage),
        ...ASSETS.sounds.map(preloadAudio),
        ...ASSETS.fonts.map(preloadFont),
      ];

      await Promise.all(promises);

      if (mounted) {
        // Ensure progress hits 100 even if calculation was slightly off
        setProgress(100);
        setTimeout(() => {
          setIsLoaded(true);
        }, 500); // Short pause at 100%
      }
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        onLoadComplete();
        setTimeout(() => setShouldRender(false), 800); // Wait for fade out animation
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, onLoadComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-800 ease-out ${
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ 
        background: "radial-gradient(circle at center, #fffbeb 0%, #fef3c7 30%, #bbf7d0 60%, #fecaca 100%)"
      }}
    >
      {/* Background Ambient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-200 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[-10%] left-[25%] w-[50vw] h-[50vw] bg-amber-100 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        <img
          src="/background/db_loading.svg"
          alt="Loading"
          className="w-32 h-32 md:w-48 md:h-48 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        
        {/* Progress Bar - Claymorphism Style */}
        <div className="w-64 md:w-80 h-4 bg-white/50 rounded-full p-1 shadow-inner backdrop-blur-sm border border-white/60">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-green-400 shadow-sm transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-[40%] bg-white/40 rounded-full" />
          </div>
        </div>
        <span className="text-sm font-bold text-slate-500 mt-1">{progress}%</span>
      </div>
    </div>
  );
}
