import { Product, Category, StoreSettings, HeroSettings, FeatureItem, Testimonial } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'barber-tools',
    name: 'أدوات الحلاقة',
    icon: '✂️',
    image: 'https://images.pexels.com/photos/13809242/pexels-photo-13809242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'ماكينات ومقصات وأدوات حلاقة احترافية'
  },
  {
    id: 'beard-care',
    name: 'العناية باللحية',
    icon: '🧔',
    image: 'https://images.pexels.com/photos/5912001/pexels-photo-5912001.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'زيوت ومراهم وأدوات العناية باللحية'
  },
  {
    id: 'hair-care',
    name: 'العناية بالشعر',
    icon: '💇',
    image: 'https://images.pexels.com/photos/18066458/pexels-photo-18066458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'شامبو وسيروم ومنتجات تصفيف الشعر'
  },
  {
    id: 'skincare',
    name: 'العناية بالبشرة',
    icon: '🧴',
    image: 'https://images.pexels.com/photos/4173450/pexels-photo-4173450.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'كريمات ومرطبات ومنتجات العناية بالبشرة'
  },
  {
    id: 'fragrances',
    name: 'العطور',
    icon: '🌸',
    image: 'https://images.pexels.com/photos/12456276/pexels-photo-12456276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'عطور رجالية فاخرة ومميزة'
  }
];

export const initialProducts: Product[] = [
  {
    id: '1', name: 'ماكينة حلاقة احترافية واهر', nameEn: 'Wahl Professional Clipper',
    description: 'ماكينة حلاقة احترافية من واهر بقوة محرك عالية، مثالية للاستخدام في الصالونات والاستخدام المنزلي. تأتي مع مجموعة متنوعة من المشابك لتناسب جميع أطوال الشعر.',
    price: 289, oldPrice: 350,
    image: 'https://images.pexels.com/photos/13809242/pexels-photo-13809242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'barber-tools', rating: 4.8, reviews: 234, inStock: true, featured: true,
    details: ['محرك قوي 45 واط', 'بطارية ليثيوم تدوم 120 دقيقة', 'شحن سريع في 60 دقيقة', '8 مشابك مختلفة', 'ضمان سنتين'],
    brand: 'Wahl', sku: 'WH-PRO-001'
  },
  {
    id: '2', name: 'مقص حلاقة ياباني فاخر', nameEn: 'Japanese Premium Scissors',
    description: 'مقص حلاقة ياباني مصنوع من فولاذ عالي الجودة، يتميز بحافة حادة ودقيقة للحصول على قصات مثالية.',
    price: 195, oldPrice: 240,
    image: 'https://images.pexels.com/photos/13809247/pexels-photo-13809247.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'barber-tools', rating: 4.9, reviews: 156, inStock: true, featured: true,
    details: ['فولاذ ياباني 440C', 'حافة حادة دقيقة', 'مقبض مريح مضاد للانزلاق', 'طول 6.5 بوصة', 'غلاف جلدي فاخر'],
    brand: 'Yasaka', sku: 'YS-SC-002'
  },
  {
    id: '3', name: 'زيت لحية طبيعي بالأرغان', nameEn: 'Natural Argan Beard Oil',
    description: 'زيت لحية طبيعي 100% مستخلص من زيت الأرغان المغربي، يرطب وينعم لحيتك ويمنع الحكة والقشور. رائحة خشبية دافئة.',
    price: 45, oldPrice: 59,
    image: 'https://images.pexels.com/photos/5912001/pexels-photo-5912001.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'beard-care', rating: 4.7, reviews: 312, inStock: true, featured: true,
    details: ['100% مكونات طبيعية', 'زيت أرغان مغربي أصلي', 'خال من البارابين', 'رائحة خشبية طبيعية', '50 مل'],
    brand: 'Cadi Premium', sku: 'KD-BO-003'
  },
  {
    id: '4', name: 'كريم وجه مرطب للرجال', nameEn: 'Men\'s Moisturizing Face Cream',
    description: 'كريم مرطب للوجه مصمم خصيصاً للرجال، يرطب البشرة بعمق ويحميها من الجفاف. تركيبة خفيفة سريعة الامتصاص.',
    price: 68, oldPrice: 85,
    image: 'https://images.pexels.com/photos/4173450/pexels-photo-4173450.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'skincare', rating: 4.6, reviews: 198, inStock: true, featured: true,
    details: ['تركيبة خفيفة سريعة الامتصاص', 'مرطب لمدة 24 ساعة', 'يحتوي على حمض الهيالورونيك', 'خال من الزيوت', '50 غرام'],
    brand: 'Cadi Premium', sku: 'KD-FC-004'
  },
  {
    id: '5', name: 'عطر رجالي أو نوار الفاخر', nameEn: 'Luxury Noir Cologne',
    description: 'عطر رجالي فاخر بمزيج من العود والعنبر والفانيلا، يمنحك إحساساً بالفخامة والأناقة.',
    price: 155, oldPrice: 199,
    image: 'https://images.pexels.com/photos/12456276/pexels-photo-12456276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'fragrances', rating: 4.9, reviews: 425, inStock: true, featured: true,
    details: ['100 مل', 'ثبات أكثر من 8 ساعات', 'مزيج العود والعنبر', 'زجاجة فاخرة', 'مثالي للمناسبات'],
    brand: 'Cadi Noir', sku: 'KN-PF-005'
  },
  {
    id: '6', name: 'شامبو أعشاب طبيعي', nameEn: 'Natural Herbal Shampoo',
    description: 'شامبو بالأعشاب الطبيعية ينظف الشعر بلطف ويغذيه من الجذور حتى الأطراف.',
    price: 35,
    image: 'https://images.pexels.com/photos/18066458/pexels-photo-18066458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'hair-care', rating: 4.5, reviews: 267, inStock: true, featured: false,
    details: ['مكونات طبيعية 95%', 'مستخلص الزعتر وإكليل الجبل', 'خال من السلفات', '300 مل', 'مناسب لجميع أنواع الشعر'],
    brand: 'Cadi Herbal', sku: 'KH-SH-006'
  },
  {
    id: '7', name: 'سيروم شعر بالكيراتين', nameEn: 'Keratin Hair Serum',
    description: 'سيروم شعر بالكيراتين يعيد الحيوية واللمعان للشعر التالف والمجعد.',
    price: 52, oldPrice: 68,
    image: 'https://images.pexels.com/photos/7020055/pexels-photo-7020055.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'hair-care', rating: 4.7, reviews: 189, inStock: true, featured: false,
    details: ['كيراتين نقي', 'حماية من الحرارة حتى 230°', 'تركيبة خفيفة غير دهنية', '30 مل', 'نتائج فورية'],
    brand: 'Cadi Pro', sku: 'KP-HS-007'
  },
  {
    id: '8', name: 'كريم بشرة مضاد للتجاعيد', nameEn: 'Anti-Aging Skin Cream',
    description: 'كريم بشرة متقدم مضاد للتجاعيد يحتوي على الريتينول والفيتامين C.',
    price: 89, oldPrice: 110,
    image: 'https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'skincare', rating: 4.8, reviews: 145, inStock: true, featured: false,
    details: ['ريتينول + فيتامين C', 'يقلل التجاعيد في 4 أسابيع', 'ترطيب عميق', '50 مل', 'خالي من البارابين'],
    brand: 'Cadi Premium', sku: 'KD-AC-008'
  },
  {
    id: '9', name: 'فوم حلاقة كريمي فاخر', nameEn: 'Premium Shaving Foam',
    description: 'فوم حلاقة كريمي يوفر حلاقة سلسة ومريحة بدون تهيج الجلد.',
    price: 28,
    image: 'https://images.pexels.com/photos/10246098/pexels-photo-10246098.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'barber-tools', rating: 4.4, reviews: 210, inStock: true, featured: false,
    details: ['مستخلص الصبار', 'زيت الجوجوبا', 'حماية من التهيج', '300 مل', 'رائحة منعشة'],
    brand: 'Cadi Care', sku: 'KC-SF-009'
  },
  {
    id: '10', name: 'مزيل عرق طبيعي للرجال', nameEn: 'Natural Men\'s Deodorant',
    description: 'مزيل عرق طبيعي يمنع الرائحة الكريهة لمدة 48 ساعة بدون انسداد المسام.',
    price: 32,
    image: 'https://images.pexels.com/photos/7546589/pexels-photo-7546589.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'skincare', rating: 4.3, reviews: 178, inStock: true, featured: false,
    details: ['حماية 48 ساعة', 'خال من الألومنيوم', 'تركيبة طبيعية', '50 مل', 'رائحة خشبية'],
    brand: 'Cadi Care', sku: 'KC-DR-010'
  },
  {
    id: '11', name: 'عطر أوبسيديان إلكسير الحصري', nameEn: 'Obsidian Elixir Exclusive',
    description: 'عطر حصري من قادي شوب بمزيج فريد من العود الكمبودي والمسك الأبيض.',
    price: 220, oldPrice: 280,
    image: 'https://images.pexels.com/photos/36339051/pexels-photo-36339051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'fragrances', rating: 5.0, reviews: 89, inStock: true, featured: true,
    details: ['100 مل', 'عود كمبودي أصلي', 'ثبات أكثر من 12 ساعة', 'زجاجة يدوية الصنع', 'إصدار محدود'],
    brand: 'Cadi Exclusive', sku: 'KE-OE-011'
  },
  {
    id: '12', name: 'مشط احترافي للشعر واللحية', nameEn: 'Professional Hair & Beard Comb',
    description: 'مشط احترافي مصنوع من الخشب الطبيعي المضاد للكهرباء الساكنة.',
    price: 18,
    image: 'https://images.pexels.com/photos/2033302/pexels-photo-2033302.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'barber-tools', rating: 4.5, reviews: 320, inStock: true, featured: false,
    details: ['خشب طبيعي', 'مضاد للكهرباء الساكنة', 'أسنان متنوعة', 'طول 17 سم', 'مقبض مريح'],
    brand: 'Cadi Tools', sku: 'KT-CB-012'
  },
  {
    id: '13', name: 'واكس تصفيف شعر قوي الثبات', nameEn: 'Strong Hold Hair Wax',
    description: 'واكس تصفيف شعر بثبات قوي يدوم طوال اليوم.',
    price: 38, oldPrice: 48,
    image: 'https://images.pexels.com/photos/4841375/pexels-photo-4841375.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'hair-care', rating: 4.6, reviews: 275, inStock: true, featured: false,
    details: ['ثبات قوي طوال اليوم', 'نهج غير لامع طبيعي', 'سهل الغسل', '100 غرام', 'رائحة منعشة خفيفة'],
    brand: 'Cadi Pro', sku: 'KP-HW-013'
  },
  {
    id: '14', name: 'طقم عناية كامل باللحية', nameEn: 'Complete Beard Care Kit',
    description: 'طقم متكامل للعناية باللحية يحتوي على زيت لحية، بلسم، مشط خشبي، ومقص تنسيق.',
    price: 120, oldPrice: 165,
    image: 'https://images.pexels.com/photos/10695044/pexels-photo-10695044.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'beard-care', rating: 4.8, reviews: 198, inStock: true, featured: true,
    details: ['زيت لحية 30 مل', 'بلسم لحية 50 غرام', 'مشط خشبي', 'مقص تنسيق', 'حقيبة جلدية فاخرة'],
    brand: 'Cadi Premium', sku: 'KD-BK-014'
  },
  {
    id: '15', name: 'عطر فاخر كلاسيكي', nameEn: 'Classic Luxury Fragrance',
    description: 'عطر كلاسيكي فاخر يجمع بين الأناقة التقليدية والحداثة.',
    price: 175,
    image: 'https://images.pexels.com/photos/35930230/pexels-photo-35930230.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'fragrances', rating: 4.7, reviews: 156, inStock: true, featured: false,
    details: ['100 مل', 'خشب الصندل والفانيلا', 'ثبات 10 ساعات', 'زجاجة أنيقة', 'مناسب لجميع الأوقات'],
    brand: 'Cadi Classic', sku: 'KC-CF-015'
  },
  {
    id: '16', name: 'كريم بشرة بحمض الهيالورونيك', nameEn: 'Hyaluronic Acid Skin Cream',
    description: 'كريم بشرة متقدم بحمض الهيالورونيك يرطب البشرة بعمق ويمنحها نضارة وإشراقة.',
    price: 75, oldPrice: 95,
    image: 'https://images.pexels.com/photos/4841482/pexels-photo-4841482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    category: 'skincare', rating: 4.6, reviews: 167, inStock: true, featured: false,
    details: ['حمض هيالورونيك عالي التركيز', 'ترطيب عميق 72 ساعة', 'مضاد للأكسدة', '50 مل', 'سريع الامتصاص'],
    brand: 'Cadi Premium', sku: 'KD-HC-016'
  }
];

export const initialHeroSettings: HeroSettings = {
  badge: '✨ عروض حصرية تصل إلى 40% خصم',
  title: 'أناقتك تبدأ من',
  titleHighlight: 'قادي شوب',
  subtitle: 'اكتشف أرقى مستلزمات الحلاقة ومنتجات العناية الشخصية. منتجات احترافية بأسعار مميزة مع توصيل سريع لباب منزلك.',
  primaryBtnText: 'تسوق الآن',
  secondaryBtnText: 'تصفح الأقسام',
  backgroundImage: 'https://images.pexels.com/photos/7195821/pexels-photo-7195821.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  stats: [
    { label: 'منتج متنوع', value: '+500' },
    { label: 'عميل سعيد', value: '+10K' },
    { label: 'دعم متواصل', value: '24/7' },
    { label: 'توصيل سريع', value: '2 يوم' },
  ]
};

export const initialFeatures: FeatureItem[] = [
  { icon: '🚚', title: 'شحن مجاني', description: 'للطلبات فوق 200 ر.س' },
  { icon: '💎', title: 'منتجات أصلية', description: 'ضمان 100%' },
  { icon: '🔄', title: 'إرجاع سهل', description: 'خلال 14 يوم' },
  { icon: '💳', title: 'دفع آمن', description: 'طرق متعددة' },
];

export const initialTestimonials: Testimonial[] = [
  { name: 'أحمد محمد', text: 'منتجات ممتازة وجودة عالية! ماكينة الحلاقة رائعة والشحن سريع جداً. أنصح الجميع بالتعامل مع قادي شوب.', rating: 5 },
  { name: 'خالد العتيبي', text: 'أفضل متجر لمستلزمات الحلاقة. زيت اللحية طبيعي 100% والنتائج ظهرت من أول استخدام. شكراً قادي شوب!', rating: 5 },
  { name: 'فهد الدوسري', text: 'تجربة تسوق مذهلة! المنتجات أصلية والأسعار منافسة. العطور الفاخرة مميزة جداً وثباتها ممتاز.', rating: 5 },
];

export const initialSettings: StoreSettings = {
  storeName: 'قادي شوب',
  storeDescription: 'متجرك المفضل لمستلزمات الحلاقة والعناية الشخصية',
  phone: '+212 6 12 34 56 78',
  whatsapp: '+212612345678',
  email: 'info@cadistore.com',
  address: 'الدار البيضاء، المملكة المغربية',
  instagram: 'cadistore',
  twitter: 'cadistore',
  freeShippingThreshold: 200,
  currency: 'د.م',
  logoUrl: '/images/logo.png',
  adminPassword: '90809080',
};
