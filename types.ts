export interface BlockData {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerging?: boolean;
  isMergedResult?: boolean;
  isLanding?: boolean;
}