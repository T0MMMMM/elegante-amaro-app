import { Item } from '@/src/types';

/** Modèle 3D par défaut (fallback). Remplace par item.model3d quand tu auras d'autres .glb. */
export const COFFEE_MODEL = require('@/src/public/models/coffee.glb');

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

/** Données mock — miroir de la table `items` (+ items_item_options via optionIds). */
export const ITEMS: Item[] = [
  // --- Cafés chauds (1) ---
  {
    id: 1,
    name: 'Espresso Intenso',
    slug: 'espresso-intenso',
    price: 2.4,
    image: img('photo-1510591509098-f4fdc6d0ff04'),
    categoryId: 1,
    description:
      'Un espresso corsé aux notes de cacao et de noisette grillée, extrait court pour une crema dense et soyeuse.',
    model3d: COFFEE_MODEL,
    optionIds: [2, 3, 4],
    featured: true,
  },
  {
    id: 2,
    name: 'Cappuccino Royal',
    slug: 'cappuccino-royal',
    price: 3.9,
    image: img('photo-1572442388796-11668a67e53d'),
    categoryId: 1,
    description:
      'Équilibre parfait entre espresso, lait vapeur et mousse veloutée, saupoudré d’un voile de cacao.',
    model3d: COFFEE_MODEL,
    optionIds: [1, 2, 5, 6],
    featured: true,
  },
  {
    id: 3,
    name: 'Latte Caramel Doré',
    slug: 'latte-caramel-dore',
    price: 4.5,
    image: img('photo-1561882468-9110e03e0f78'),
    categoryId: 1,
    description:
      'Latte onctueux nappé d’un caramel beurre salé maison, couronné d’une chantilly légère.',
    model3d: COFFEE_MODEL,
    optionIds: [1, 4, 5],
    featured: true,
  },
  {
    id: 4,
    name: 'Mocha Velours',
    slug: 'mocha-velours',
    price: 4.7,
    image: img('photo-1578314675249-a6910f80cc4e'),
    categoryId: 1,
    description:
      'Chocolat noir de couverture fondu dans un espresso généreux, lait vapeur et copeaux de cacao.',
    optionIds: [1, 2, 6],
  },
  {
    id: 5,
    name: 'Flat White Signature',
    slug: 'flat-white-signature',
    price: 4.2,
    image: img('photo-1517256064527-09c73fc73e38'),
    categoryId: 1,
    description:
      'Double ristretto et microfoam serrée pour une texture dense et un café tout en rondeur.',
    optionIds: [2, 5],
  },

  // --- Boissons froides (2) ---
  {
    id: 6,
    name: 'Iced Latte Amaro',
    slug: 'iced-latte-amaro',
    price: 4.8,
    image: img('photo-1461023058943-07fcbe16d735'),
    categoryId: 2,
    description:
      'Notre signature glacée : espresso amer, lait frais et glace pilée, servie sur un trait de sirop vanille.',
    model3d: COFFEE_MODEL,
    optionIds: [1, 3, 4, 5],
    featured: true,
  },
  {
    id: 7,
    name: 'Cold Brew 18h',
    slug: 'cold-brew-18h',
    price: 4.6,
    image: img('photo-1517701604599-bb29b565090c'),
    categoryId: 2,
    description:
      'Infusion à froid pendant 18 heures, profil rond et faible en acidité, aux arômes de fruits mûrs.',
    optionIds: [3, 7],
  },
  {
    id: 8,
    name: 'Frappé Noisette',
    slug: 'frappe-noisette',
    price: 5.2,
    image: img('photo-1572490122747-3968b75cc699'),
    categoryId: 2,
    description:
      'Café frappé crémeux à la noisette, couronné de chantilly et d’un filet de caramel doré.',
    optionIds: [1, 4, 6],
  },

  // --- Pâtisseries (3) ---
  {
    id: 9,
    name: 'Croissant au Beurre',
    slug: 'croissant-au-beurre',
    price: 1.9,
    image: img('photo-1555507036-ab1f4038808a'),
    categoryId: 3,
    description:
      'Pur beurre AOP, feuilletage doré et croustillant, façonné chaque matin par notre boulanger.',
    optionIds: [],
  },
  {
    id: 10,
    name: 'Macaron Vanille',
    slug: 'macaron-vanille',
    price: 2.3,
    image: img('photo-1569864358642-9d1684040f43'),
    categoryId: 3,
    description:
      'Coque lisse et ganache à la vanille de Madagascar, fondante et délicatement parfumée.',
    optionIds: [],
  },
  {
    id: 11,
    name: 'Tarte au Citron',
    slug: 'tarte-au-citron',
    price: 3.8,
    image: img('photo-1519915028121-7d3463d20b13'),
    categoryId: 3,
    description:
      'Crème de citron acidulée sur sablé breton, meringue italienne légèrement caramélisée.',
    optionIds: [],
  },

  // --- Thés & infusions (4) ---
  {
    id: 12,
    name: 'Thé Earl Grey Impérial',
    slug: 'the-earl-grey-imperial',
    price: 3.2,
    image: img('photo-1576092768241-dec231879fc3'),
    categoryId: 4,
    description:
      'Thé noir de Ceylan parfumé à la bergamote de Calabre, élégant et finement boisé.',
    optionIds: [7],
  },
  {
    id: 13,
    name: 'Chaï Latte Épicé',
    slug: 'chai-latte-epice',
    price: 4.1,
    image: img('photo-1571934811356-5cc061b6821f'),
    categoryId: 4,
    description:
      'Mélange d’épices (cannelle, cardamome, gingembre) infusé dans un lait vapeur onctueux.',
    optionIds: [1, 5, 7],
  },
  {
    id: 14,
    name: 'Infusion Verveine-Menthe',
    slug: 'infusion-verveine-menthe',
    price: 3.0,
    image: img('photo-1597481499750-3e6b22637e12'),
    categoryId: 4,
    description:
      'Infusion apaisante de verveine et menthe fraîche, sans théine, parfaite en fin de journée.',
    optionIds: [7],
  },
];
