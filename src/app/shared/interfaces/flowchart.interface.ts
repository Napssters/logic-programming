export interface FlowchartStep {
  id: number;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
  next?: number;
  branches?: { yes?: number; no?: number };
  loopBack?: number;
}
