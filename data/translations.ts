export type Language = 'en' | 'id';

export interface StepItem {
  num: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ValueCard {
  title: string;
  description: string;
}

export interface CourseTranslation {
  title: string;
  mentorRole: string;
}

export const translations = {
  en: {
    navbar: {
      roadmap: 'Roadmap',
      courses: 'Courses',
      mentors: 'Mentors',
      verifyCert: 'Verify Certificate',
      logIn: 'Log In',
      startLearning: 'Start Learning',
    },
    hero: {
      badge: 'Zero to Production-Ready',
      headline: 'Master Modern Coding from Scratch.',
      subheadline:
        'Structured curriculums, 1-on-1 industry mentorship, and real production projects. Go from your first line of code to landing your dream tech role with measurable confidence.',
      exploreCourses: 'Explore Courses',
      tryFreeLesson: 'Try Free Lesson',
      ratingText: '4.9/5',
      graduatesCount: '12,400+',
      graduatesText: 'Over 12,400+ graduates hired globally',
      livePreview: 'Live Preview',
      compiling: 'Compiling...',
      compiledIn: 'Compiled in',
      welcomeMsg: 'Welcome to CodePath',
      versionReady: 'v2.4 Ready',
      recompileTooltip: 'Click to recompile',
      tabApp: 'App.tsx',
      tabDemo: 'CourseDemo.ts',
      copiedNotice: 'Snippet copied to clipboard!',
    },
    curriculum: {
      eyebrow: 'Curriculum Flow',
      headline: 'Your Path From Zero to Tech Industry Hire',
      subheadline:
        'An engineered blueprint created with hiring managers. Master production-grade code without tutorial-hell paralysis.',
      steps: [
        {
          num: '01',
          title: 'Logic & Algorithms',
          description:
            'Master foundational computational thinking, Python/JS fundamentals, and core data structures through automated testing.',
          tags: ['#Algorithms', 'TypeScript'],
        },
        {
          num: '02',
          title: 'Frontend Development',
          description:
            'Build responsive, high-performance UIs using TypeScript, React 19, Tailwind CSS, state management, and Next.js SSR.',
          tags: ['React 19', 'Next.js', 'Tailwind'],
        },
        {
          num: '03',
          title: 'Backend & Database',
          description:
            'Design robust REST & GraphQL APIs, resilient microservices, PostgreSQL schema modeling, and Redis in-memory caching.',
          tags: ['Node / Express', 'PostgreSQL', 'Redis'],
        },
        {
          num: '04',
          title: 'Fullstack Deployment',
          description:
            'Containerize with Docker, establish automated GitHub Actions CI/CD pipelines, and deploy production apps on AWS & Vercel.',
          tags: ['Docker', 'AWS', 'CI/CD'],
        },
      ] as StepItem[],
    },
    catalog: {
      eyebrow: 'Explore Curriculum',
      headline: 'Industry-Vetted Courses',
      subheadline:
        'Every syllabus is curated directly by principal engineers and tech leads actively building high-scale products.',
      filterAll: 'All Levels',
      filterBeginner: 'Beginner',
      filterIntermediate: 'Intermediate',
      filterAdvanced: 'Advanced',
      lessonsLabel: 'Lessons',
      hoursLabel: 'Hours',
      certificateLabel: 'Certificate',
      enrollNow: 'Enroll Now',
      viewAllCourses: 'View All 50+ Courses in Curriculum',
      cohortAdmissions: 'Admissions Open',
    },
    valueProp: {
      eyebrow: 'The CodePath Standard',
      headline: 'Engineered for Real Career Breakthroughs',
      subheadline:
        'We replace passive video watching with synchronous feedback loops, direct Pull Request reviews, and authentic credential validation.',
      coreBadge: 'Interactive 3D Tech Core (Drag to rotate)',
      cards: [
        {
          title: '1-on-1 Code Reviews',
          description:
            'Line-by-line feedback on every commit from vetted staff engineers.',
        },
        {
          title: 'Lifetime Community',
          description:
            'Private Discord channels, pair pairing, and job referral boards.',
        },
        {
          title: 'Verified Certificate',
          description:
            'Cryptographically verifiable credential with LinkedIn 1-click add.',
        },
        {
          title: 'Pass-or-Refund',
          description:
            'Full 14-day satisfaction guarantee, no tedious questions asked.',
        },
      ] as ValueCard[],
    },
    footer: {
      tagline:
        'Rigorous developer education built for candidates serious about ambitious engineering careers.',
      systemsOperational: 'Systems Operational',
      exploreTitle: 'Explore Courses',
      tracks: [
        'Full-stack Web Development',
        'Cloud & DevOps Engineering',
        'Applied AI & Machine Learning',
        'Curriculum Roadmaps',
      ],
      verifyTitle: 'Verify Credential',
      verifyDesc:
        'Instant authenticity checks for alumni certificates and course completion badges.',
      verifyPlaceholder: 'Enter Certificate ID (e.g. CP-2026-889)',
      verifyBtn: 'CHECK',
      newsletterTitle: 'Stay Updated',
      newsletterDesc:
        'Weekly engineering case studies, tech talks, and open admissions alerts.',
      newsletterPlaceholder: 'Developer email address',
      subscribeBtn: 'Subscribe',
      copyright: 'CodePath Academy, Inc. All rights reserved.',
      links: {
        directory: 'Credential Directory',
        mentorship: 'Mentorship Network',
        pathways: 'Learning Pathways',
      },
    },
    authModal: {
      loginBadge: 'Developer Authentication',
      welcomeBack: 'Welcome back, Developer',
      welcomeRegister: 'Create Your Free Account',
      loginSubtitle: 'Log in to continue your coding roadmap and access your dashboard.',
      registerSubtitle: 'Join thousands of developers mastering modern software engineering.',
      tabLogin: 'Log In',
      tabRegister: 'Create Free Account',
      fullNameLabel: 'FULL NAME',
      fullNamePlaceholder: 'Enter your full name',
      emailLabel: 'EMAIL ADDRESS',
      emailPlaceholder: 'name@example.com',
      passwordLabel: 'PASSWORD',
      passwordPlaceholder: 'Enter your password',
      passwordRegisterPlaceholder: 'Create a strong password',
      keepSignedIn: 'Keep me signed in for 30 days',
      forgotPassword: 'Forgot password?',
      btnSubmitting: 'Authenticating...',
      btnLogin: 'Log In to Dashboard',
      btnRegister: 'Create Free Student Account',
      orDivider: 'OR CONTINUE WITH EMAIL',
      continueWithGoogle: 'Continue with Google',
      footerFreeNote:
        'New to CodePath? Creating an account is 100% free — pay only when you enroll in a pro track.',
    },
    authPage: {
      backToHome: 'Back to Home',
      campusSubtitle: 'ENGINEERING CAMPUS',
      cohortBadge: 'Engineering Cohort Admissions Open',
      heroHeadline: 'Master the craft. Build production systems with real engineers.',
      heroDescription:
        'Join thousands of aspiring software engineers mastering modern full-stack development, AI orchestration, and cloud architecture with direct 1-on-1 industry mentorship.',
      alumniRating: '5.0 / Verified Alumni',
      testimonialQuote:
        "CodePath's Sema AI helped me debug my React projects with sharp Socratic hints without spoon-feeding answers. Landed my first frontend role in 4 months.",
      alumniName: 'Alex Vance',
      alumniCohort: 'Fullstack Next.js Alumni • Cohort #12',
      hiredBadge: 'Hired at Tech Unicorn',
      activeDevelopers: '12,400+ Active Developers • Free Account Access',
      securitySpecs: 'TLS 1.3 • OAuth 2.0 • Encrypted',
      mobileHome: 'Home',
      tabLogin: 'Log In',
      tabRegister: 'Create Free Account',
      badgeLogin: 'Developer Authentication',
      badgeRegister: 'Free Student Registration',
      titleLogin: 'Welcome back, Developer',
      titleRegister: 'Create Your Free Account',
      subtitleLogin: 'Log in to continue your coding roadmap and access your dashboard.',
      subtitleRegister: 'Join 12,400+ developers mastering modern full-stack and AI systems.',
      continueWithGoogle: 'Continue with Google',
      orDivider: 'OR CONTINUE WITH EMAIL',
      fullNameLabel: 'FULL NAME',
      fullNamePlaceholder: 'Enter your full name',
      emailLabel: 'EMAIL ADDRESS',
      emailPlaceholder: 'name@example.com',
      passwordLabel: 'PASSWORD',
      passwordLoginPlaceholder: 'Enter your password',
      passwordRegisterPlaceholder: 'Create a strong password',
      forgotPassword: 'Forgot password?',
      passwordResetNotice: 'Password reset link sent to your registered email.',
      keepSignedIn: 'Keep me signed in for 30 days',
      submitLogin: 'Log In to Dashboard',
      submitRegister: 'Create Free Student Account',
      footerNote:
        'New to CodePath? Creating an account is 100% free — pay only when you enroll in a pro track.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      securityWhitepaper: 'Security Whitepaper',
    },
    freeLessonModal: {
      badge: 'FREE PREVIEW LESSON',
      trackName: 'TypeScript Fundamentals Track',
      title: 'Type-Safe API Contracts with Generics & Automated CI Tests',
      runTests: 'Run Tests',
      runningTests: 'Running Tests...',
      testRunnerTitle: 'CodePath Automated Test Runner',
      testRunnerVersion: 'Jest / Vitest v2.1',
      testPlaceholder:
        "Click 'Run Tests' to compile TypeScript and evaluate test assertions against your code.",
      mentorTitle: 'Sema AI Socratic Code Mentor',
      mentorSubtitle: 'Guided by Sema AI • Socratic Hints & Debugging Prompts',
      mentorCohort: 'Sema AI Active',
      quickPromptsTitle: 'Quick Discussion Prompts:',
      prompt1: '💡 Why Generics over any?',
      prompt2: '🔍 Review for edge cases',
      inputPlaceholder: 'Ask Sema AI a conceptual or debugging question...',
    },
    certModal: {
      title: 'Official Credential Verification System',
      badge: 'Official Database Record',
      searchPlaceholder: 'Search Certificate ID (e.g. CP-2026-889)',
      verifyBtn: 'Verify',
      credentialId: 'Credential ID',
      issueDate: 'Issue Date',
      grade: 'Grade / Score',
      conferredTo: 'This is proudly conferred upon',
      skillsTitle: 'Verified Core Competencies',
      copyUrl: 'Copy Verification URL',
      copied: 'Copied!',
      addToLinkedIn: 'Add to LinkedIn',
      verifiedActive: 'Verified Active',
    },
    enrollModal: {
      trackSuffix: 'Track',
      cohortAdmissions: 'Cohort Admissions',
      syllabusIncludes: 'Syllabus & Cohort Perks:',
      features: [
        'Live 1-on-1 code reviews with staff engineers on GitHub',
        'Direct Pull Request reviews & production CI/CD tests',
        'Official cryptographically verifiable credential',
        'Full 14-day 100% money-back guarantee',
      ],
      paymentMethod: 'SELECT PAYMENT METHOD',
      qrisDesc: 'Instant Indonesian standard QR code scan (GoPay, OVO, Dana, BCA, Mandiri)',
      vaDesc: 'BCA, Mandiri, BNI, BRI Automated Virtual Account',
      ewalletDesc: 'Direct 1-tap checkout via registered e-wallet',
      ccDesc: 'Visa, Mastercard, JCB with 3D Secure Protection',
      guaranteeNotice: '14-Day Money-Back Guarantee • 256-Bit SSL Encrypted Checkout',
      enrollBtn: 'Enroll Now',
      processingBtn: 'Processing Payment...',
      successTitle: 'Admissions Confirmed!',
      successDesc: 'Welcome to CodePath Academy! We have provisioned your student portal credentials and sent welcome orientation details to your email.',
      dashboardBtn: 'Go to My Student Dashboard',
    },
  },
  id: {
    navbar: {
      roadmap: 'Alur Belajar',
      courses: 'Katalog Kelas',
      mentors: 'Mentor',
      verifyCert: 'Cek Sertifikat',
      logIn: 'Masuk',
      startLearning: 'Mulai Belajar',
    },
    hero: {
      badge: 'Dari Nol Hingga Siap Kerja',
      headline: 'Kuasai Coding Modern dari Nol Hingga Siap Kerja.',
      subheadline:
        'Kurikulum terstruktur, bimbingan 1-on-1 bersama praktisi industri, dan proyek skala produksi nyata. Mulai dari baris kode pertama hingga meraih karir tech impian dengan percaya diri terukur.',
      exploreCourses: 'Lihat Katalog Kelas',
      tryFreeLesson: 'Coba Materi Gratis',
      ratingText: '4.9/5',
      graduatesCount: '12.400+',
      graduatesText: 'Lebih dari 12.400+ alumni tersalurkan kerja global',
      livePreview: 'Live Preview',
      compiling: 'Mengompilasi...',
      compiledIn: 'Dikompilasi dlm',
      welcomeMsg: 'Selamat Datang di CodePath',
      versionReady: 'v2.4 Siap',
      recompileTooltip: 'Klik untuk mengompilasi ulang',
      tabApp: 'App.tsx',
      tabDemo: 'CourseDemo.ts',
      copiedNotice: 'Kode berhasil disalin ke clipboard!',
    },
    curriculum: {
      eyebrow: 'Alur Kurikulum',
      headline: 'Jalur Terarah dari Nol Hingga Karir Industri Tech',
      subheadline:
        'Cetak biru rekayasa perangkat lunak bersama para hiring manager. Kuasai kode standar produksi tanpa terjebak tutorial-hell.',
      steps: [
        {
          num: '01',
          title: 'Logika & Algoritma',
          description:
            'Kuasai fondasi computational thinking, fundamental Python/TypeScript, dan struktur data esensial melalui automated unit testing.',
          tags: ['#Algoritma', 'TypeScript'],
        },
        {
          num: '02',
          title: 'Pengembangan Frontend',
          description:
            'Bangun antarmuka modern berperforma tinggi dengan TypeScript, React 19, Tailwind CSS, state management, dan Next.js SSR.',
          tags: ['React 19', 'Next.js', 'Tailwind'],
        },
        {
          num: '03',
          title: 'Backend & Basis Data',
          description:
            'Rancang REST & GraphQL API tangguh, microservices terdistribusi, pemodelan skema PostgreSQL, dan Redis in-memory caching.',
          tags: ['Node / Express', 'PostgreSQL', 'Redis'],
        },
        {
          num: '04',
          title: 'Deployment Fullstack',
          description:
            'Kontainerisasi dengan Docker, bangun pipeline otomatis GitHub Actions CI/CD, dan deploy aplikasi produksi di AWS & Vercel.',
          tags: ['Docker', 'AWS', 'CI/CD'],
        },
      ] as StepItem[],
    },
    catalog: {
      eyebrow: 'Jelajahi Kurikulum',
      headline: 'Kursus Standar Industri',
      subheadline:
        'Setiap silabus dikurasi langsung oleh principal engineer dan tech lead yang aktif membangun produk berskala jutaan pengguna.',
      filterAll: 'Semua Level',
      filterBeginner: 'Pemula',
      filterIntermediate: 'Menengah',
      filterAdvanced: 'Mahir',
      lessonsLabel: 'Materi',
      hoursLabel: 'Jam',
      certificateLabel: 'Sertifikat',
      enrollNow: 'Daftar Kelas',
      viewAllCourses: 'Lihat Semua 50+ Kelas di Kurikulum',
      cohortAdmissions: 'Pendaftaran Dibuka',
    },
    valueProp: {
      eyebrow: 'Standar Rekayasa CodePath',
      headline: 'Dirancang untuk Lompatan Karir Nyata',
      subheadline:
        'Kami mengganti menonton video pasif dengan siklus feedback sinkron, review Pull Request langsung dari engineer senior, dan validasi sertifikat otentik.',
      coreBadge: 'Tech Core 3D Interaktif (Geser untuk memutar)',
      cards: [
        {
          title: 'Review Kode 1-on-1',
          description:
            'Feedback baris-demi-baris pada setiap commit PR Anda langsung dari staff engineer terverifikasi.',
        },
        {
          title: 'Komunitas Seumur Hidup',
          description:
            'Akses channel privat Discord, sesi pair programming, dan papan referensi lowongan kerja eksklusif.',
        },
        {
          title: 'Sertifikat Terverifikasi',
          description:
            'Kredensial digital terverifikasi kriptografis dengan fitur 1-klik tambah ke profil LinkedIn.',
        },
        {
          title: 'Garansi Lulus atau Uang Kembali',
          description:
            'Jaminan kepuasan penuh 14 hari tanpa syarat berbelit jika kurikulum tidak sesuai ekspektasi.',
        },
      ] as ValueCard[],
    },
    footer: {
      tagline:
        'Pendidikan rekayasa perangkat lunak berstandar tinggi bagi kandidat yang serius membangun karir tech berkaliber tinggi.',
      systemsOperational: 'Sistem Beroperasi',
      exploreTitle: 'Jelajahi Kursus',
      tracks: [
        'Pengembangan Web Full-Stack',
        'Rekayasa Cloud & DevOps',
        'AI Terapan & Machine Learning',
        'Roadmap Kurikulum',
      ],
      verifyTitle: 'Cek Kredensial',
      verifyDesc:
        'Verifikasi keaslian instan untuk sertifikat kelulusan alumni dan lencana keahlian.',
      verifyPlaceholder: 'Masukkan ID Sertifikat (cth. CP-2026-889)',
      verifyBtn: 'CEK',
      newsletterTitle: 'Tetap Terhubung',
      newsletterDesc:
        'Studi kasus engineering mingguan, tech talk alumni, dan jadwal pembukaan cohort baru.',
      newsletterPlaceholder: 'Alamat email developer',
      subscribeBtn: 'Berlangganan',
      copyright: 'CodePath Academy, Inc. Hak cipta dilindungi undang-undang.',
      links: {
        directory: 'Direktori Kredensial',
        mentorship: 'Jaringan Mentor',
        pathways: 'Jalur Pembelajaran',
      },
    },
    authModal: {
      loginBadge: 'Autentikasi Pengembang',
      welcomeBack: 'Selamat Datang Kembali',
      welcomeRegister: 'Buat Akun Gratis Anda',
      loginSubtitle: 'Masuk untuk melanjutkan roadmap coding dan mengakses dashboard Anda.',
      registerSubtitle: 'Bergabung bersama ribuan developer menguasai rekayasa software modern.',
      tabLogin: 'Masuk',
      tabRegister: 'Buat Akun Gratis',
      fullNameLabel: 'NAMA LENGKAP',
      fullNamePlaceholder: 'Masukkan nama lengkap Anda',
      emailLabel: 'ALAMAT EMAIL',
      emailPlaceholder: 'nama@example.com',
      passwordLabel: 'KATA SANDI',
      passwordPlaceholder: 'Masukkan kata sandi Anda',
      passwordRegisterPlaceholder: 'Buat kata sandi yang kuat',
      keepSignedIn: 'Ingat saya selama 30 hari',
      forgotPassword: 'Lupa kata sandi?',
      btnSubmitting: 'Mengautentikasi...',
      btnLogin: 'Masuk ke Dashboard',
      btnRegister: 'Daftar Akun Siswa Gratis',
      orDivider: 'ATAU LANJUTKAN DENGAN EMAIL',
      continueWithGoogle: 'Lanjutkan dengan Google',
      footerFreeNote:
        'Baru di CodePath? Pembuatan akun 100% gratis — bayar hanya saat Anda mendaftar cohort pro.',
    },
    authPage: {
      backToHome: 'Kembali ke Beranda',
      campusSubtitle: 'KAMPUS REKAYASA TEKNOLOGI',
      cohortBadge: 'Pendaftaran Angkatan Rekayasa Dibuka',
      heroHeadline: 'Kuasai keahlian. Bangun sistem produksi bersama engineer nyata.',
      heroDescription:
        'Bergabung bersama ribuan calon software engineer menguasai full-stack modern, orkestrasi AI, dan arsitektur cloud dengan bimbingan langsung 1-on-1 dari mentor industri.',
      alumniRating: '5.0 / Alumni Terverifikasi',
      testimonialQuote:
        '“Sema AI di CodePath membantuku debugging proyek React dengan petunjuk Sokrates tanpa langsung menyuapi jawaban. Berhasil meraih peran frontend pertamaku dalam 4 bulan.”',
      alumniName: 'Alex Vance',
      alumniCohort: 'Alumni Fullstack Next.js • Angkatan #12',
      hiredBadge: 'Diterima di Tech Unicorn',
      activeDevelopers: '12.400+ Developer Aktif • Akses Akun Gratis',
      securitySpecs: 'TLS 1.3 • OAuth 2.0 • Terenkripsi',
      mobileHome: 'Beranda',
      tabLogin: 'Masuk',
      tabRegister: 'Buat Akun Gratis',
      badgeLogin: 'Autentikasi Developer',
      badgeRegister: 'Pendaftaran Akun Siswa Gratis',
      titleLogin: 'Selamat Datang Kembali, Developer',
      titleRegister: 'Buat Akun Gratis Kamu',
      subtitleLogin: 'Masuk untuk melanjutkan roadmap coding dan mengakses dashboard kamu.',
      subtitleRegister: 'Bergabung dengan 12.400+ developer menguasai full-stack modern dan sistem AI.',
      continueWithGoogle: 'Lanjutkan dengan Google',
      orDivider: 'ATAU LANJUTKAN DENGAN EMAIL',
      fullNameLabel: 'NAMA LENGKAP',
      fullNamePlaceholder: 'Masukkan nama lengkap kamu',
      emailLabel: 'ALAMAT EMAIL',
      emailPlaceholder: 'nama@example.com',
      passwordLabel: 'KATA SANDI',
      passwordLoginPlaceholder: 'Masukkan kata sandi kamu',
      passwordRegisterPlaceholder: 'Buat kata sandi yang kuat',
      forgotPassword: 'Lupa kata sandi?',
      passwordResetNotice: 'Tautan reset kata sandi telah dikirim ke email terdaftar Anda.',
      keepSignedIn: 'Biarkan saya tetap masuk selama 30 hari',
      submitLogin: 'Masuk ke Dashboard',
      submitRegister: 'Buat Akun Siswa Gratis',
      footerNote:
        'Baru di CodePath? Pembuatan akun 100% gratis — bayar hanya saat kamu mendaftar di kelas pro.',
      privacyPolicy: 'Kebijakan Privasi',
      termsOfService: 'Ketentuan Layanan',
      securityWhitepaper: 'Dokumentasi Keamanan',
    },
    freeLessonModal: {
      badge: 'PRATINJAU MATERI GRATIS',
      trackName: 'Track Fundamental TypeScript',
      title: 'Type-Safe API Contracts dengan Generics & Automated CI Tests',
      runTests: 'Jalankan Tes',
      runningTests: 'Menjalankan Tes...',
      testRunnerTitle: 'CodePath Automated Test Runner',
      testRunnerVersion: 'Jest / Vitest v2.1',
      testPlaceholder:
        "Klik 'Jalankan Tes' untuk mengompilasi TypeScript dan mengevaluasi tes otomatis terhadap kode Anda.",
      mentorTitle: 'Sema AI Socratic Code Mentor',
      mentorSubtitle: 'Didampingi Sema AI • Petunjuk & Penalaran Mandiri',
      mentorCohort: 'Sema AI Aktif',
      quickPromptsTitle: 'Pertanyaan Diskusi Cepat:',
      prompt1: '💡 Mengapa Generics dibanding any?',
      prompt2: '🔍 Cek penanganan kasus batas',
      inputPlaceholder: 'Tanyakan konsep atau debugging ke Sema AI...',
    },
    certModal: {
      title: 'Sistem Verifikasi Kredensial Resmi',
      badge: 'Catatan Database Terverifikasi',
      searchPlaceholder: 'Cari ID Sertifikat (cth. CP-2026-889)',
      verifyBtn: 'Verifikasi',
      credentialId: 'ID Kredensial',
      issueDate: 'Tanggal Penerbitan',
      grade: 'Predikat / Nilai',
      conferredTo: 'Dengan bangga dianugerahkan kepada',
      skillsTitle: 'Kompetensi Inti Terverifikasi',
      copyUrl: 'Salin Tautan Verifikasi',
      copied: 'Tersalin!',
      addToLinkedIn: 'Tambah ke LinkedIn',
      verifiedActive: 'Terverifikasi Aktif',
    },
    enrollModal: {
      trackSuffix: 'Track',
      cohortAdmissions: 'Penerimaan Cohort',
      syllabusIncludes: 'Silabus & Keuntungan Cohort:',
      features: [
        'Review kode 1-on-1 langsung bersama staff engineer di GitHub',
        'Uji Pull Request langsung dengan production CI/CD tests',
        'Kredensial sertifikat resmi terverifikasi kriptografis',
        'Garansi 100% uang kembali penuh dalam 14 hari',
      ],
      paymentMethod: 'PILIH METODE PEMBAYARAN',
      qrisDesc: 'Pindai QRIS instan dari semua bank & e-wallet (GoPay, OVO, Dana, BCA, Mandiri)',
      vaDesc: 'Virtual Account Otomatis BCA, Mandiri, BNI, BRI',
      ewalletDesc: 'Pembayaran instan 1-klik melalui e-wallet terdaftar',
      ccDesc: 'Visa, Mastercard, JCB dengan Proteksi 3D Secure',
      guaranteeNotice: 'Garansi 14 Hari Uang Kembali • Checkout Terenkripsi 256-Bit SSL',
      enrollBtn: 'Daftar Kelas Sekarang',
      processingBtn: 'Memproses Pembayaran...',
      successTitle: 'Pendaftaran Terkonfirmasi!',
      successDesc: 'Selamat datang di CodePath Academy! Akses dashboard siswa Anda telah dibuat dan panduan orientasi telah dikirim ke email Anda.',
      dashboardBtn: 'Buka Dashboard Siswa Saya',
    },
  },
};

