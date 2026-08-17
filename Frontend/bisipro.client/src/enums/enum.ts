export const BisiType = {
  FixedRotation: 1,
  Auction: 2,
  LuckyDraw: 3,
  ManualSelection: 4,
} as const;

export type BisiType = typeof BisiType[keyof typeof BisiType];

