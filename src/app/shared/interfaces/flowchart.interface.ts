export interface FlowchartStep {
  id: number;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}
