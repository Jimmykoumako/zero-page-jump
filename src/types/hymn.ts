
export interface Hymn {
  id: number;
  number: number;
  title: string;
  subtitle?: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

export interface HymnData {
  hymns: Hymn[];
  loading: boolean;
}
