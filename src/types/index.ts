// CREATE FILE: src/types/index.ts
export type Token = {
  id: string;
  value: number;
  x: number;
  y: number;
};

export type Region = {
  id: string;
  x: number;
  y: number;
  radius: number;
  target: number;
  color: string;
};
