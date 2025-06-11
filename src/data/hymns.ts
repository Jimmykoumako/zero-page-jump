
export interface Hymn {
  id: number;
  number: number;
  title: string;
  subtitle?: string;
  author: string;
  verses: string[];
  chorus?: string;
  key?: string;
  tempo?: number;
}

// Mock data for development - replace with actual data source
export const mockHymns: Hymn[] = [
  {
    id: 1,
    number: 1,
    title: "Amazing Grace",
    author: "John Newton",
    verses: [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.",
      "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home."
    ],
    key: "G",
    tempo: 120
  },
  {
    id: 2,
    number: 2,
    title: "How Great Thou Art",
    author: "Stuart K. Hine",
    verses: [
      "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.",
      "When through the woods and forest glades I wander\nAnd hear the birds sing sweetly in the trees,\nWhen I look down from lofty mountain grandeur\nAnd hear the brook and feel the gentle breeze."
    ],
    chorus: "Then sings my soul, my Savior God, to Thee:\nHow great Thou art! How great Thou art!\nThen sings my soul, my Savior God, to Thee:\nHow great Thou art! How great Thou art!",
    key: "Bb",
    tempo: 110
  }
];

export const getHymnById = (id: number): Hymn | undefined => {
  return mockHymns.find(hymn => hymn.id === id);
};

export const getAllHymns = (): Hymn[] => {
  return mockHymns;
};
