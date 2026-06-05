import { OngoingOrder, OrderSummary } from '@/src/types';

/** Commandes en cours (mock) — suivi en temps réel. */
export const ONGOING_ORDERS: OngoingOrder[] = [
  {
    id: 2052,
    number: 'EA-2052',
    stateLabel: 'En préparation',
    stateStep: 2,
    typeLabel: 'Sur place',
    tableNumber: 4,
    total: 11.3,
    placedAtLabel: "Aujourd'hui à 10:12",
    items: [
      { name: 'Cappuccino Royal', quantity: 1 },
      { name: 'Latte Caramel Doré', quantity: 1 },
      { name: 'Croissant au Beurre', quantity: 2 },
    ],
  },
  {
    id: 2050,
    number: 'EA-2050',
    stateLabel: 'En attente',
    stateStep: 1,
    typeLabel: 'À emporter',
    total: 4.8,
    placedAtLabel: "Aujourd'hui à 10:05",
    items: [{ name: 'Iced Latte Amaro', quantity: 1 }],
  },
];

/** Commandes passées (mock) — historique. */
export const PAST_ORDERS: OrderSummary[] = [
  { id: 2048, number: 'EA-2048', dateLabel: '5 juin 2026', stateLabel: 'Servie', total: 12.4, itemCount: 3 },
  { id: 2031, number: 'EA-2031', dateLabel: '2 juin 2026', stateLabel: 'Servie', total: 7.9, itemCount: 2 },
  { id: 1990, number: 'EA-1990', dateLabel: '28 mai 2026', stateLabel: 'Annulée', total: 4.5, itemCount: 1 },
  { id: 1974, number: 'EA-1974', dateLabel: '24 mai 2026', stateLabel: 'Servie', total: 15.2, itemCount: 4 },
];
