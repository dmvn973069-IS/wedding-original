export const weddingData = {
  // =========================================================
  // COUPLE
  // =========================================================
  couple: {
    shortName: "A & H",
    hashtag: "#AnhThuVanHieu",
    quote:
      "Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.",
  },

  // =========================================================
  // BRIDE
  // =========================================================
  bride: {
    name: "Anh Thư",
    fullName: "Lã Anh Thư",
    qr: "/qr/bride-qr.png",

    bank: {
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
  },

  // =========================================================
  // GROOM
  // =========================================================
  groom: {
    name: "Văn Hiếu",
    fullName: "Trần Văn Hiếu",
    qr: "/qr/groom-qr.png",

    bank: {
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
  },

  // =========================================================
  // WEDDING
  // =========================================================
  wedding: {
    date: "2026-11-28",
    displayDate: "28 . 11 . 2026",

    reception: {
      title: "Tiệc mừng",
      time: "16:30",
      date: "Thứ Bảy, 28/11/2026",
      datetime: "2026-11-28T16:30:00+07:00",
      side: "Nhà gái",

      description:
        "Trân trọng kính mời quý khách đến dự tiệc và chung vui cùng gia đình.",
    },

    ceremony: {
      title: "Lễ thành hôn",
      time: "12:20",
      date: "Chủ nhật, 29/11/2026",
      datetime: "2026-11-29T12:20:00+07:00",
      side: "Nhà trai",

      description:
        "Hôn lễ được cử hành trong không khí ấm cúng cùng gia đình và những người thân yêu.",
    },

    dressCode: {
      title: "Dress Code",

      description:
        "Nếu thuận tiện, hãy cùng chúng mình lựa chọn những gam màu nhẹ nhàng để tạo nên một khung hình thật đẹp trong ngày đặc biệt.",

      colors: [
        {
          name: "Hồng phấn",
          value: "#E8B7C5",
        },
        {
          name: "Kem",
          value: "#F6EBDD",
        },
        {
          name: "Xanh sage",
          value: "#AFC1AE",
        },
        {
          name: "Nâu hồng",
          value: "#9A6675",
        },
      ],
    },
  },

  // =========================================================
  // FAMILIES
  // =========================================================
  families: {
    bride: {
      label: "Nhà gái",

      father: "Lã Văn Viết",
      mother: "Trịnh Thị Thơm",

      address: "Thôn Tân Phong, xã Bình An, Tỉnh Ninh Bình",

      location: {
        name: "Tư gia nhà gái",

        latitude: 20.501129150390625,
        longitude: 106.07402801513672,

        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=20.501129150390625,106.07402801513672&gidzl=N2PgSSssfbbMC69opQgkNLWsQdNK-FeA4pHkBuFu-L10P3rqswx-2nnbEII7-wuEGs1iSpcYgFKSohwcMW",
      },
    },

    groom: {
      label: "Nhà trai",

      father: "Trần Văn Hưng",
      mother: "Cù Thị Thắm",

      address: "Thôn Tiên Xuân, xã Bình An, Tỉnh Ninh Bình",

      location: {
        name: "Tư gia nhà trai",

        // Chưa có tọa độ chính xác nên tạm để null
        latitude: null,
        longitude: null,

        // Khi có link Google Maps nhà trai thì điền vào đây
        mapUrl: "",
      },
    },
  },

  // =========================================================
  // INVITATION LETTER
  // =========================================================
  invitation: {
    heading: "Lời mời thân thương",

    opening: "Gửi những người thân yêu của chúng mình,",

    paragraphs: [
      "Sau bao chặng đường, chúng mình thật may mắn khi tìm thấy nhau và cùng viết nên câu chuyện tình yêu của riêng mình. Mỗi cuộc gặp gỡ, mỗi nụ cười và từng khoảnh khắc bên nhau đều trở thành những ký ức mà chúng mình luôn trân trọng.",

      "Hôm nay, chúng mình quyết định bước sang một hành trình mới, hành trình của gia đình, yêu thương, sẻ chia và đồng hành.",

      "Ngày vui sẽ thật trọn vẹn nếu có sự hiện diện của bạn. Chúng mình mong được đón bạn đến chung vui, cùng lưu giữ những khoảnh khắc đáng nhớ và trao nhau những lời chúc tốt đẹp nhất.",
    ],

    closing: "Cảm ơn và hẹn gặp bạn trong ngày vui! ♡",
  },

  // =========================================================
  // LOVE STORY
  // =========================================================
  story: {
    eyebrow: "Our Love Story",

    title: "Hành trình của chúng mình",

    introduction:
      "Từ những cuộc gặp gỡ bình dị, chúng mình đã cùng nhau đi qua thật nhiều kỷ niệm. Ngày hôm nay là một cột mốc mới, nơi hai hành trình riêng biệt chính thức trở thành một.",

    milestones: [
      {
        year: "Ngày gặp nhau",

        title: "Một cuộc gặp gỡ thật đặc biệt",

        description:
          "Giữa rất nhiều người, chúng mình đã tìm thấy nhau và bắt đầu bằng những câu chuyện giản dị nhất.",

        image: "/images/couple-01.jpg",
      },

      {
        year: "Những ngày bên nhau",

        title: "Cùng viết nên những kỷ niệm",

        description:
          "Từng chuyến đi, từng bữa ăn và từng khoảnh khắc bình thường đều trở nên ý nghĩa khi có nhau.",

        image: "/images/couple-03.jpg",
      },

      {
        year: "Lời hẹn ước",

        title: "Mình cùng về chung một nhà nhé",

        description:
          "Sau những ngày yêu thương và đồng hành, chúng mình quyết định cùng nhau bước sang một chương mới.",

        image: "/images/couple-06.jpg",
      },

      {
        year: "28 . 11 . 2026",

        title: "Ngày mình gọi nhau là gia đình",

        description:
          "Một ngày mới, một mái ấm mới và một hành trình dài phía trước mà chúng mình sẽ cùng nhau vun đắp.",

        image: "/images/couple-08.jpg",
      },
    ],
  },

  // =========================================================
  // WEDDING SCHEDULE
  // =========================================================
  schedule: [
    {
      time: "16:00",

      title: "Đón khách",

      description:
        "Gia đình cùng cô dâu chú rể hân hoan chào đón quý khách đến chung vui.",
    },

    {
      time: "16:30",

      title: "Khai tiệc",

      description:
        "Buổi tiệc chính thức bắt đầu trong không khí ấm áp cùng gia đình và những người thân yêu.",
    },

    {
      time: "17:00",

      title: "Nâng ly chúc mừng",

      description:
        "Cùng nâng ly và gửi những lời chúc tốt đẹp nhất đến đôi uyên ương.",
    },

    {
      time: "18:30",

      title: "Lưu giữ kỷ niệm",

      description:
        "Cùng nhau chụp những bức ảnh thật đẹp để lưu giữ khoảnh khắc đáng nhớ của ngày hôm nay.",
    },
  ],

  // =========================================================
  // RSVP
  // =========================================================
  rsvp: {
    enabled: true,

    deadline: "20/11/2026",

    title: "Bạn sẽ đến chung vui chứ?",

    description:
      "Vui lòng xác nhận trước ngày 20/11/2026 để chúng mình có thể chuẩn bị đón tiếp bạn chu đáo nhất.",

    /**
     * Ví dụ:
     *
     * phone: "0912345678"
     *
     * Nếu để trống, component sẽ tự ẩn nút gửi SMS.
     */
    phone: "",

    /**
     * Nếu sử dụng Google Forms:
     *
     * formUrl: "https://forms.gle/..."
     *
     * Nếu không dùng thì để trống.
     */
    formUrl: "",
  },

  // =========================================================
  // WISHES
  // Có thể sử dụng sau nếu muốn làm guestbook
  // =========================================================
  wishes: {
    title: "Sổ lưu bút",

    description:
      "Hãy gửi đến chúng mình một lời chúc thật dễ thương cho hành trình mới.",
  },

  // =========================================================
  // WEBSITE / SEO
  // =========================================================
  site: {
    title: "Thiệp cưới Anh Thư & Văn Hiếu",

    description:
      "Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của Anh Thư và Văn Hiếu.",

    locale: "vi_VN",

    themeColor: "#B95C7D",
  },

  // =========================================================
  // MEDIA
  // =========================================================
  media: {
    cover: "/images/couple-09.jpg",

    hero: "/images/couple-04.jpg",

    gallery: [
      "/images/couple-01.jpg",
      "/images/couple-02.jpg",
      "/images/couple-03.jpg",
      "/images/couple-05.jpg",
      "/images/couple-06.jpg",
      "/images/couple-07.jpg",
      "/images/couple-08.jpg",
    ],

    ogImage: "/images/couple-04.jpg",
  },

  // =========================================================
  // MUSIC
  // =========================================================
  music: {
    src: "/audio/music.mp3",

    title: "Our Wedding Song",

    autoplayAfterOpen: true,
  },
} as const;

/**
 * Type dùng cho các component khác nếu cần.
 *
 * import type { WeddingData } from "@/app/wedding-data";
 */
export type WeddingData = typeof weddingData;
