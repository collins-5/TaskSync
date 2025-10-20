export interface SlideData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export const slideData: SlideData[] = [
  {
    id: 1,
    title: 'All the doctors you need in one app',
    description:
      'We bring to you board-certified specialists from every department. Nurses, oncologists, dentists, you name them. ',
    imageUrl: require('../../../assets/onboard/find-doctor1.png'),
  },
  {
    id: 2,
    title: 'Wherever you are, we can reach you',
    description:
      'From in-house visits to clinic and virtual consultations, we at rastuc offer you solutions at your convenience',
    imageUrl: require('../../../assets/onboard/convenience2.png'),
  },
  {
    id: 3,
    title: 'Understand the scope of your insurance',
    description:
      'Explore our vast insurance options and the various clinics and doctors that accept your plan.',
    imageUrl: require('../../../assets/onboard/insurance3.png'),
  },
  {
    id: 4,
    title: 'Your data is safe with us',
    description:
      'Use our Medical passport to keep all your medical documents and records safe in one place',
    imageUrl: require('../../../assets/onboard/medical-wallet4.png'),
  },
  {
    id: 5,
    title: 'Do not waste your time in queues because of delays',
    description: ' We value your time. Stay updated in real time on any delays or closures',
    imageUrl: require('../../../assets/onboard/queue5.png'),
  },
];
