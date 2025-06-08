
export interface Hymn {
  id: number;
  number: number;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

export const hymns: Hymn[] = [
  {
    id: 1,
    number: 1,
    title: "Amazing Grace",
    author: "John Newton",
    key: "G",
    tempo: 80,
    verses: [
      "Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see",
      "'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed",
      "Through many dangers, toils and snares\nI have already come\n'Tis grace hath brought me safe thus far\nAnd grace will lead me home",
      "When we've been there ten thousand years\nBright shining as the sun\nWe've no less days to sing God's praise\nThan when we first begun"
    ]
  },
  {
    id: 2,
    number: 15,
    title: "How Great Thou Art",
    author: "Stuart K. Hine",
    key: "Bb",
    tempo: 85,
    verses: [
      "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made\nI see the stars, I hear the rolling thunder\nThy power throughout the universe displayed",
      "When through the woods and forest glades I wander\nAnd hear the birds sing sweetly in the trees\nWhen I look down from lofty mountain grandeur\nAnd hear the brook and feel the gentle breeze",
      "And when I think that God, His Son not sparing\nSent Him to die, I scarce can take it in\nThat on the cross, my burden gladly bearing\nHe bled and died to take away my sin",
      "When Christ shall come with shout of acclamation\nAnd take me home, what joy shall fill my heart\nThen I shall bow in humble adoration\nAnd there proclaim, my God, how great Thou art"
    ],
    chorus: "Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art\nThen sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art"
  },
  {
    id: 3,
    number: 23,
    title: "Holy, Holy, Holy",
    author: "Reginald Heber",
    key: "D",
    tempo: 90,
    verses: [
      "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee\nHoly, holy, holy! Merciful and mighty!\nGod in three Persons, blessed Trinity!",
      "Holy, holy, holy! All the saints adore Thee\nCasting down their golden crowns around the glassy sea\nCherubim and seraphim falling down before Thee\nWhich wert, and art, and evermore shalt be",
      "Holy, holy, holy! Though the darkness hide Thee\nThough the eye of sinful man Thy glory may not see\nOnly Thou art holy; there is none beside Thee\nPerfect in power, in love, and purity",
      "Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy name in earth and sky and sea\nHoly, holy, holy! Merciful and mighty!\nGod in three Persons, blessed Trinity!"
    ]
  },
  {
    id: 4,
    number: 32,
    title: "Be Thou My Vision",
    author: "Ancient Irish",
    key: "Eb",
    tempo: 75,
    verses: [
      "Be Thou my vision, O Lord of my heart\nNaught be all else to me, save that Thou art\nThou my best thought, by day or by night\nWaking or sleeping, Thy presence my light",
      "Be Thou my wisdom, and Thou my true word\nI ever with Thee and Thou with me, Lord\nThou my great Father, I Thy true son\nThou in me dwelling, and I with Thee one",
      "Riches I heed not, nor man's empty praise\nThou mine inheritance, now and always\nThou and Thou only, first in my heart\nHigh King of heaven, my treasure Thou art",
      "High King of heaven, my victory won\nMay I reach heaven's joys, O bright heaven's Sun\nHeart of my own heart, whatever befall\nStill be my vision, O Ruler of all"
    ]
  },
  {
    id: 5,
    number: 45,
    title: "It Is Well With My Soul",
    author: "Horatio G. Spafford",
    key: "C",
    tempo: 85,
    verses: [
      "When peace like a river attendeth my way\nWhen sorrows like sea billows roll\nWhatever my lot, Thou hast taught me to say\nIt is well, it is well with my soul",
      "Though Satan should buffet, though trials should come\nLet this blest assurance control\nThat Christ hath regarded my helpless estate\nAnd hath shed His own blood for my soul",
      "My sin oh the bliss of this glorious thought\nMy sin not in part, but the whole\nIs nailed to the cross and I bear it no more\nPraise the Lord, praise the Lord, O my soul",
      "And Lord, haste the day when my faith shall be sight\nThe clouds be rolled back as a scroll\nThe trump shall resound and the Lord shall descend\nEven so, it is well with my soul"
    ],
    chorus: "It is well with my soul\nIt is well, it is well with my soul"
  },
  {
    id: 6,
    number: 67,
    title: "Blessed Assurance",
    author: "Fanny J. Crosby",
    key: "D",
    tempo: 95,
    verses: [
      "Blessed assurance, Jesus is mine\nO what a foretaste of glory divine\nHeir of salvation, purchase of God\nBorn of His Spirit, washed in His blood",
      "Perfect submission, perfect delight\nVisions of rapture now burst on my sight\nAngels descending bring from above\nEchoes of mercy, whispers of love",
      "Perfect submission, all is at rest\nI in my Savior am happy and blest\nWatching and waiting, looking above\nFilled with His goodness, lost in His love"
    ],
    chorus: "This is my story, this is my song\nPraising my Savior all the day long\nThis is my story, this is my song\nPraising my Savior all the day long"
  }
];
