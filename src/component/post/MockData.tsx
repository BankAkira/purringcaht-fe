import LogoCat from '../../asset/images/logo-cat.svg';
import PurrPostComingSoon from '../../asset/images/PurrPost-Coming-Soon.webp';

const mockData = [
  {
    userName: 'Purring Chat',
    avatar: LogoCat,
    image: PurrPostComingSoon,
    post: 'PurrPost is an interactive announcement board within Purring Chat that allows users to post or advertise anything publicly. Each post on this space is called a "Purr." Users can Purr or RePurr other users Purrs on their personal pages, enhancing visibility and engagement.',
    isFollow: false,
    date: '',
    toRePurr: {
      isToRePurr: false,
      userName: '',
      avatar: '',
      image: '',
      post: '',
      date: '',
    },
    purr: {
      isPurr: false,
      hasPurr: '0',
    },
    comment: {
      isComment: false,
      hasComment: '0',
    },
    rePurr: {
      isRePurr: false,
      hasRePurr: '0',
    },
    view: {
      isView: false,
      hasView: '0',
    },
    catTreats: {
      isCatTreats: false,
      treats: '0',
    },
    bookmark: {
      isBookmark: false,
    },
    share: {
      isShare: false,
    },
  },
  // {
  //   userName: 'Marvin Mckinney',
  //   avatar:
  //     'https://s.isanook.com/ca/0/ui/279/1396205/download20190701165129_1562561119.jpg',
  //   image: '',
  //   post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //   isFollow: true,
  //   date: '1m',
  //   toRePurr: {
  //     isToRePurr: true,
  //     userName: 'Marvin Mckinney',
  //     avatar:
  //       'https://s.isanook.com/ca/0/ui/279/1396205/download20190701165129_1562561119.jpg',
  //     image: '',
  //     post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //     date: '1m',
  //   },
  //   purr: {
  //     isPurr: true,
  //     hasPurr: '10',
  //   },
  //   comment: {
  //     isComment: true,
  //     hasComment: '2',
  //   },
  //   rePurr: {
  //     isRePurr: true,
  //     hasRePurr: '1',
  //   },
  //   view: {
  //     isView: true,
  //     hasView: '25',
  //   },
  //   catTreats: {
  //     isCatTreats: true,
  //     treats: '20',
  //   },
  //   bookmark: {
  //     isBookmark: true,
  //   },
  //   share: {
  //     isShare: true,
  //   },
  // },
  // {
  //   userName: 'Bonnie Green',
  //   avatar:
  //     'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ0p5NpICI_aTD4HLK2eRMmqisLCQ02dZL9FuzhXgIw-a3Wuwen',
  //   image: '',
  //   post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers. Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers. Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //   isFollow: true,
  //   date: '30m',
  //   toRePurr: {
  //     isToRePurr: false,
  //     userName: '',
  //     avatar: '',
  //     image: '',
  //     post: '',
  //     date: '',
  //   },
  //   purr: {
  //     isPurr: true,
  //     hasPurr: '47',
  //   },
  //   comment: {
  //     isComment: false,
  //     hasComment: '15',
  //   },
  //   rePurr: {
  //     isRePurr: false,
  //     hasRePurr: '4',
  //   },
  //   view: {
  //     isView: false,
  //     hasView: '138',
  //   },
  //   catTreats: {
  //     isCatTreats: true,
  //     treats: '5',
  //   },
  //   bookmark: {
  //     isBookmark: false,
  //   },
  //   share: {
  //     isShare: false,
  //   },
  // },
  // {
  //   userName: 'Robert Fox',
  //   avatar:
  //     'https://s.isanook.com/ca/0/ui/279/1396205/s__152616986_1562561122.jpg',
  //   image:
  //     'https://img.freepik.com/free-photo/cyber-cat-with-giant-electro-flowers-sunrise-generative-ai_8829-2880.jpg',
  //   post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //   isFollow: true,
  //   date: '48m',
  //   toRePurr: {
  //     isToRePurr: false,
  //     userName: '',
  //     avatar: '',
  //     image: '',
  //     post: '',
  //     date: '',
  //   },
  //   purr: {
  //     isPurr: false,
  //     hasPurr: '278',
  //   },
  //   comment: {
  //     isComment: false,
  //     hasComment: '52',
  //   },
  //   rePurr: {
  //     isRePurr: false,
  //     hasRePurr: '47',
  //   },
  //   view: {
  //     isView: false,
  //     hasView: '2.4k',
  //   },
  //   catTreats: {
  //     isCatTreats: false,
  //     treats: '',
  //   },
  //   bookmark: {
  //     isBookmark: false,
  //   },
  //   share: {
  //     isShare: false,
  //   },
  // },
  // {
  //   userName: 'Robert Fox',
  //   avatar:
  //     'https://s.isanook.com/ca/0/ui/279/1396205/s__152616986_1562561122.jpg',
  //   image: '',
  //   post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //   isFollow: true,
  //   date: '1h',
  //   toRePurr: {
  //     isToRePurr: true,
  //     userName: 'Marvin Mckinney',
  //     avatar:
  //       'https://s.isanook.com/ca/0/ui/279/1396205/download20190701165129_1562561119.jpg',
  //     image:
  //       'https://i.etsystatic.com/41355720/r/il/e1ed76/4738346497/il_570xN.4738346497_3r4d.jpg',
  //     post: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
  //     date: '3day',
  //   },
  //   purr: {
  //     isPurr: true,
  //     hasPurr: '502',
  //   },
  //   comment: {
  //     isComment: true,
  //     hasComment: '128',
  //   },
  //   rePurr: {
  //     isRePurr: false,
  //     hasRePurr: '79',
  //   },
  //   view: {
  //     isView: true,
  //     hasView: '5k',
  //   },
  //   catTreats: {
  //     isCatTreats: true,
  //     treats: '25',
  //   },
  //   bookmark: {
  //     isBookmark: true,
  //   },
  //   share: {
  //     isShare: true,
  //   },
  // },
  // {
  //   userName: 'Robert Fox',
  //   avatar:
  //     'https://s.isanook.com/ca/0/ui/279/1396205/s__152616986_1562561122.jpg',
  //   image:
  //     'https://aiartshop.com/cdn/shop/files/ai-cat-style-design-artwork-691.webp?v=1706630919',
  //   post: 'CAT AI',
  //   isFollow: true,
  //   date: '3h',
  //   toRePurr: {
  //     isToRePurr: false,
  //     userName: '',
  //     avatar: '',
  //     image: '',
  //     post: '',
  //     date: '',
  //   },
  //   purr: {
  //     isPurr: true,
  //     hasPurr: '1.5k',
  //   },
  //   comment: {
  //     isComment: true,
  //     hasComment: '235',
  //   },
  //   rePurr: {
  //     isRePurr: false,
  //     hasRePurr: '92',
  //   },
  //   view: {
  //     isView: true,
  //     hasView: '10k',
  //   },
  //   catTreats: {
  //     isCatTreats: true,
  //     treats: '50',
  //   },
  //   bookmark: {
  //     isBookmark: true,
  //   },
  //   share: {
  //     isShare: true,
  //   },
  // },
];

export default mockData;
