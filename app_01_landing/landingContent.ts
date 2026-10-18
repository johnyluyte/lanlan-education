// Landing Page 的文案、連結與圖片都集中在這裡，之後抽換文字只要改這個檔案。
// 圖片來源與授權見 public/images/landing/CREDITS.md。
// 數字與單位之間用不換行空白（\u00a0），避免「12」和「歲」被拆到兩行。

import { parseGridLine } from '#alias-landing/gridHeadline'

export interface LandingLink {
  label: string
  to: string
}

export interface LandingImage {
  src: string
  alt: string
  width: number
  height: number
}

// 還沒做的頁面先統一連到「建置中」頁
export const COMING_SOON = '/landing/coming-soon'

export const brand = {
  name: '蘭芳教育',
  tagline: '陪 3\u00a0到\u00a012\u00a0歲的孩子，一步一步綻放。',
  pageTitle: '蘭芳教育｜讓每個孩子，都有綻放的時刻',
}

export const navLinks: LandingLink[] = [
  { label: '適合誰', to: '/landing#audiences' },
  { label: '學習領域', to: '/landing#subjects' },
  { label: '如何開始', to: '/landing#steps' },
  { label: '使用心得', to: '/landing#stories' },
  { label: '常見問題', to: '/landing#faq' },
]

export const headerLinks = {
  login: { label: '登入', to: COMING_SOON },
  signup: { label: '免費註冊', to: COMING_SOON },
}

export const hero = {
  // 螢幕閱讀器讀這一行；畫面上顯示的是下方 rows 的田字格版本，兩者文字要一致
  title: '讓每個孩子，都有綻放的時刻',
  // 田字格每一列；「字(注音)」寫法，注音可查教育部《重編國語辭典修訂本》
  rows: [
    parseGridLine('讓(ㄖㄤˋ)每(ㄇㄟˇ)個(ㄍㄜˋ)孩(ㄏㄞˊ)子(˙ㄗ)，'),
    parseGridLine('都(ㄉㄡ)有(ㄧㄡˇ)綻(ㄓㄢˋ)放(ㄈㄤˋ)的(˙ㄉㄜ)時(ㄕˊ)刻(ㄎㄜˋ)'),
  ],
  description:
    '蘭芳教育把注音、識字、數學與手眼協調，設計成 3\u00a0到\u00a012\u00a0歲孩子願意天天練習的小活動。家長在家陪練、老師帶進教室、治療師安排個別課程，都能直接使用。',
  primaryCta: { label: '免費註冊', to: COMING_SOON },
  secondaryCta: { label: '看看學習活動', to: '/landing#subjects' },
  stamp: '好棒',
  photos: {
    main: {
      src: '/images/landing/hero-main.webp',
      alt: '大人陪著女孩坐在沙發上，一起用蠟筆替圖畫著色',
      width: 1400,
      height: 933,
    },
    detail: {
      src: '/images/landing/hero-detail.webp',
      alt: '孩子拿著蠟筆，替獨角獸圖案塗上顏色',
      width: 720,
      height: 480,
      caption: '自己塗完的獨角獸',
    },
  },
}

export const audiences = {
  title: '在家、在教室、在治療室，都用得上',
  description: '同一套學習活動，依陪伴的角色調整用法。',
  items: [
    {
      id: 'parents',
      icon: 'i-lucide-house',
      title: '給家長',
      lead: '每天 15\u00a0分鐘，陪孩子把基礎打穩。',
      points: ['依年齡推薦當天的練習', '孩子自己就能操作的介面', '每週成長紀錄，一眼看懂進步'],
      link: { label: '家長怎麼開始', to: COMING_SOON },
      image: {
        src: '/images/landing/audience-parent.webp',
        alt: '媽媽坐在女兒身旁，看她在作業本上寫字',
        width: 1000,
        height: 667,
      },
    },
    {
      id: 'teachers',
      icon: 'i-lucide-school',
      title: '給老師',
      lead: '備課時間省下來，留給孩子。',
      points: ['依單元快速組出學習單', '全班一起玩的互動活動', '可以列印，也可以投影'],
      link: { label: '老師怎麼開始', to: COMING_SOON },
      image: {
        src: '/images/landing/audience-teacher.webp',
        alt: '老師坐在教室裡拿著數字卡，帶小女孩用手指數數',
        width: 1000,
        height: 667,
      },
    },
    {
      id: 'therapists',
      icon: 'i-lucide-hand-heart',
      title: '給治療師',
      lead: '為每個孩子調整難度與節奏。',
      points: ['精細動作與視知覺練習', '步驟、提示與難度都能自訂', '產生居家練習單，家長也能配合'],
      link: { label: '治療師怎麼開始', to: COMING_SOON },
      image: {
        src: '/images/landing/audience-therapist.webp',
        alt: '大人和女孩坐在桌邊，一起玩木製玩具',
        width: 1000,
        height: 667,
      },
    },
  ],
}

// 分頁標籤用幼兒園課綱的領域名稱；class 要寫完整字串，Tailwind 才掃得到
export const subjects = {
  title: '四個學習領域，由淺入深',
  description: '每個活動都標示建議年齡與練習重點，孩子可以照自己的步調往下走。',
  items: [
    {
      id: 'language',
      tab: '語文',
      title: '注音與識字',
      ages: '4\u00a0到\u00a08\u00a0歲',
      description: '從ㄅㄆㄇ拼讀到常用字筆順，搭配圖卡與發音，讓孩子聽得懂、念得出、寫得對。',
      activities: ['注音拼讀', '生字筆順', '語詞配對'],
      tabClass: 'bg-coral-300',
      chipClass: 'border-coral-200 bg-coral-50 text-coral-800',
      image: {
        src: '/images/landing/subject-language.webp',
        alt: '兩個小女孩坐在書桌前專心寫字',
        width: 900,
        height: 600,
      },
    },
    {
      id: 'math',
      tab: '認知',
      title: '數感與邏輯',
      ages: '3\u00a0到\u00a010\u00a0歲',
      description: '點數、比較、分類到規律推理，用積木、數獨和迷宮建立數學直覺。',
      activities: ['點數練習', '數獨', '迷宮'],
      tabClass: 'bg-azure-300',
      chipClass: 'border-azure-200 bg-azure-50 text-azure-800',
      image: {
        src: '/images/landing/subject-math.webp',
        alt: '小女孩坐在地墊上撥算盤珠子',
        width: 900,
        height: 1350,
      },
    },
    {
      id: 'motor',
      tab: '身體動作',
      title: '握筆與手眼協調',
      ages: '3\u00a0到\u00a08\u00a0歲',
      description: '連點成線、仿畫線條、剪貼拼圖，練習手部控制與視覺追視，為寫字做好準備。',
      activities: ['連點成線', '仿畫線條', '剪貼拼圖'],
      tabClass: 'bg-orchid-300',
      chipClass: 'border-orchid-200 bg-orchid-50 text-orchid-800',
      image: {
        src: '/images/landing/subject-motor.webp',
        alt: '孩子的小手正在堆疊木頭積木',
        width: 900,
        height: 1600,
      },
    },
    {
      id: 'art',
      tab: '美感',
      title: '色彩與創作',
      ages: '3\u00a0到\u00a012\u00a0歲',
      description: '認識顏色、形狀與對稱，在自由創作中練習觀察，也練習把想法表達出來。',
      activities: ['色彩配對', '對稱繪圖', '立體摺紙'],
      tabClass: 'bg-sun-300',
      chipClass: 'border-sun-200 bg-sun-50 text-sun-800',
      image: {
        src: '/images/landing/subject-art.webp',
        alt: '女孩拿著水彩筆在畫紙上作畫',
        width: 900,
        height: 1350,
      },
    },
  ],
}

export const steps = {
  title: '三個步驟，今天就能開始',
  description: '不用下載 App，打開瀏覽器就能用。',
  items: [
    { title: '免費註冊', description: '用 Email 建立帳號，一分鐘完成。' },
    { title: '設定孩子的年齡與目標', description: '選好想加強的領域，系統會推薦適合的活動。' },
    { title: '線上練習或列印', description: '在平板上互動練習，也可以列印成學習單帶著走。' },
  ],
}

// 示意用的回饋內容；正式上線前務必換成真實使用者、經同意刊登的分享
export const stories = {
  title: '家長、老師與治療師的回饋',
  description: '聽聽他們怎麼把學習活動放進每天的生活。',
  items: [
    { quote: '以前一看到注音就想逃，現在吃完飯會自己說要玩『拼音關卡』。', name: '陳媽媽', role: '幼兒園大班家長' },
    { quote: '學習單可以照單元直接組，印出來就能上課，備課時間至少省一半。', name: '林老師', role: '國小一年級導師' },
    { quote: '仿畫線條的難度可以一格一格調，很適合安排給需要精細動作訓練的孩子。', name: '王治療師', role: '兒童職能治療師' },
  ],
}

export const faq = {
  title: '常見問題',
  description: '沒找到答案？寫信給我們，一個工作天內回覆。',
  contact: { label: '聯絡我們', to: COMING_SOON },
  items: [
    { label: '適合幾歲的孩子？', content: '以 3\u00a0到\u00a012\u00a0歲為主。每個活動都標示建議年齡，也能依孩子的程度調整難度。' },
    { label: '需要付費嗎？', content: '註冊後就能免費使用基本活動；進階內容與班級管理功能會另外提供方案。' },
    { label: '可以在平板或手機上使用嗎？', content: '可以。網站支援電腦、平板與手機，學習單也能直接列印。' },
    { label: '老師可以帶整個班級一起使用嗎？', content: '可以建立班級、指派活動，並查看全班的練習狀況。' },
    { label: '治療師可以替個案調整活動內容嗎？', content: '可以。多數活動都能自訂步驟、提示與難度，也能產生居家練習單讓家長配合。' },
  ],
}

export const cta = {
  title: '陪孩子，從第一份練習開始',
  description: '註冊只要一分鐘，馬上就能挑選適合孩子年齡的學習活動。',
  primary: { label: '免費註冊', to: COMING_SOON },
  secondary: { label: '學校與機構合作', to: COMING_SOON },
}

export const footer = {
  columns: [
    {
      title: '平台',
      links: [
        { label: '學習領域', to: '/landing#subjects' },
        { label: '如何開始', to: '/landing#steps' },
        { label: '方案與價格', to: COMING_SOON },
      ],
    },
    {
      title: '資源',
      links: [
        { label: '學習單下載', to: COMING_SOON },
        { label: '親子共學文章', to: COMING_SOON },
        { label: '常見問題', to: '/landing#faq' },
      ],
    },
    {
      title: '關於',
      links: [
        { label: '品牌故事', to: COMING_SOON },
        { label: '聯絡我們', to: COMING_SOON },
        { label: '隱私權政策', to: COMING_SOON },
        { label: '服務條款', to: COMING_SOON },
      ],
    },
  ],
  socials: [
    { label: 'Facebook', icon: 'i-simple-icons-facebook', to: COMING_SOON },
    { label: 'Instagram', icon: 'i-simple-icons-instagram', to: COMING_SOON },
    { label: 'YouTube', icon: 'i-simple-icons-youtube', to: COMING_SOON },
    { label: 'LINE', icon: 'i-simple-icons-line', to: COMING_SOON },
  ],
}

export const comingSoon = {
  title: '建置中',
  rows: [parseGridLine('建(ㄐㄧㄢˋ)置(ㄓˋ)中(ㄓㄨㄥ)')],
  heading: '這一頁還在準備中',
  description: '內容整理好之後會放在這裡。先回首頁看看其他介紹吧。',
  primary: { label: '回到首頁', to: '/landing' },
  secondary: { label: '看看學習領域', to: '/landing#subjects' },
}
