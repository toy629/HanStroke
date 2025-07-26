const musicPlaylist = [ { name: "Ukulele", path: "audio/happy-whistling-ukulele-115485.mp3" } ];
// ✨ 1. 新增：定義您的成就獎勵
// 您可以在這裡自由新增圖片和達成條件
const progressRewards = {
    // 根據練習字數（星星數）的獎勵
    byStars: {
        1: { src: 'images/reward_star_10.jpg', name: '練習新星' },
        30: { src: 'images/reward_star_30.jpg', name: '成長高手' },
        60: { src: 'images/reward_star_60.jpg', name: '識字大師' },
        100: { src: 'images/reward_star_100.jpeg', name: '寫字大師' },
        150: { src: 'images/reward_star_150.jpeg', name: '寫字狂人' },
        200: { src: 'images/reward_star_200.jpeg', name: '超級高手' },
        
    },
    byLevel: {},
    // 預設（沒有達成任何成就時）顯示的圖片
    default: { src: 'images/reward_star_10.jpg', name: '開始你的旅程吧！' }
};
// ✨ 1. 全新的「規則化」獎勵設定
const levelRewards = [
    {
        // 規則一：符合您舉例的「康軒一上 L1-L6」隨機影片
        id: 'KANGXUAN_G1a_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '一上',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_3.mp4' }
        ]
    },
    {
        // 規則一：符合您舉例的「康軒一上 L1-L6」隨機影片
        id: 'KANGXUAN_G1b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '一下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_3.mp4' }
        ]
    },
            {
        // 規則一：符合您舉例的「康軒一上 L1-L6」隨機影片
        id: 'KANGXUAN_G1b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '一下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_5.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_6.mp4' }
        ]
    },
    {
        // 規則一：符合您舉例的「康軒一上 L1-L6」隨機影片
        id: 'KANGXUAN_G2a1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '二上',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' }
        ]
    },
            {
        id: 'KANGXUAN_G2a2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '二上',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_5.mp4' },
        ]
    },   
    {
        id: 'KANGXUAN_G2b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '二下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },
            {
        id: 'KANGXUAN_G2b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '二下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },
            {
        // 規則一：符合您舉例的「南一一上 L1-L6」隨機影片
        id: 'nan-i_G1a_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '一上',
            lessons: ['魔法文字','第一課', '第二課', '第三課', '第四課', '第五課', '第六課','第七課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_3.mp4' }
        ]
    },
    {
        id: 'nan-i_G1b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '一下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_3.mp4' }
        ]
    },
            {
        id: 'nan-i_G1b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '一下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_5.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_6.mp4' }
        ]
    },
    {
        id: 'nan-i_G2a1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '二上',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' }
        ]
    },
            {
        id: 'nan-i_G2a2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '二上',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_5.mp4' },
        ]
    },   
    {
        id: 'nan-i_G2b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '二下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },
            {
        id: 'nan-i_G2b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '南一',
            grade: '二下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },    
            {
        // 規則一：符合您舉例的「南一一上 L1-L6」隨機影片
        id: 'han-lin_G1a_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '一上',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課','第七課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1a/random_reward_3.mp4' }
        ]
    },
    {
        id: 'han-lin_G1b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '一下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_3.mp4' }
        ]
    },
            {
        id: 'han-lin_G1b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '一下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g1b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_5.mp4' },
            { type: 'video', src: 'videos/g1b/random_reward_6.mp4' }
        ]
    },
    {
        id: 'han-lin_G2a1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '康軒',
            grade: '二上',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' }
        ]
    },
            {
        id: 'han-lin_G2a2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '二上',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2a/random_reward_3.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2a/random_reward_5.mp4' },
        ]
    },   
    {
        id: 'han-lin_G2b1_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '二下',
            lessons: ['第一課', '第二課', '第三課', '第四課', '第五課', '第六課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_1.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },
            {
        id: 'han-lin_G2b2_INTRO', // 給這個規則一個獨特的名稱
        conditions: {
            version: '翰林',
            grade: '二下',
            lessons: ['第七課', '第八課', '第九課', '第十課', '第十一課', '第十二課']
        },
        rewards: [ // 這個陣列中可以放多個獎勵，系統會隨機挑選一個
            { type: 'video', src: 'videos/g2b/random_reward_4.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_2.mp4' },
            { type: 'video', src: 'videos/g2b/random_reward_3.mp4' }
        ]
    },    
                
    // 您可以在此新增更多規則...
];
const socialLinksData = [
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/bossyunlife', // <-- 請換成您的 Facebook 網址
        icon_src: 'images/facebook_icon.png'  // <-- 請確認圖檔路徑
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/agnesc629/', // <-- 請換成您的 Instagram 網址
        icon_src: 'images/instagram_icon.png' // <-- 請確認圖檔路徑
    }
];
const externalLinksData = [
    {
        title: '康軒試讀本',
        description: '免費索取康軒讀本。',
        url: 'https://ibanana.biz/3NUZ9',
        icon: '📚' // 您可以用表情符號或圖片
    },
    {
        title: '國字標準字體筆順學習網',
        description: '教育部官方的筆順學習網站。',
        url: 'https://stroke-order.learningweb.moe.edu.tw/',
        icon: '✍️'
    },
    {
        title: '我們在這裡上英文',
        description: '51talk 免費試聽',
        url: 'https://joymall.co/3NUZO',
        icon: '📖'
    },
    // ✨ 1. 在這裡插入一個換行標記
    //{ type: 'break' },
    // ✨ 2. 在下面新增您想要的第四個、第五個...連結
    //{
    //    title: '新的連結按鈕',
    //    description: '這是顯示在第二排的第一個按鈕。',
    //    url: 'https://example.com',
    //    icon: '🚀'
    //}   
]