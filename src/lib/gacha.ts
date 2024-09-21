interface GachaItem {
    name: string;
    message: string;
    weight: number;
    rarity?: string;
}
type GachaTier = "normal" | "rare" | "super rare" | "ultra rare" | "legendary rare" | "misc";

interface GachaBin {
    category: GachaTier;
    items: GachaItem[];
}

type GachaPool = {
    [key in GachaTier]: GachaBin;
};

export const POWERUP_KRATINGDAENG = "kratingdaeng";

const NormalBin: GachaBin = {
    category: "normal",
    items: [
        {
            name: "Donut",
            weight: 1,
            message: "...\n..\n.\nAren't ya one cheap person. Kechi.",
        },
        {
            name: "A pinch of whiskas",
            weight: 1,
            message: "...do I need to explicitly say that I'm hungry? Well, at least better than nothing, you stingy.",
        },
        {
            name: "A glass of water",
            weight: 1.5,
            message: "...this is basically cost you nothing, right?",
        },
    ],
};

const RareBin: GachaBin = {
    category: "rare",
    items: [
        {
            name: "Roti Yoland",
            weight: 2,
            message: "Now we're talking! Hey, wanna know what flavor of roti yoland that I think the best? Hehe.... ひ。み。つ！",
        },
        {
            name: "Black Thunder",
            weight: 2.5,
            message: "Wow, this is something. Sweet stuff! And crunchy! (❁´◡`❁)",
        },
        {
            name: "Grape Nutrijell Pudding",
            weight: 3,
            message: "This is a weird one but it's surprisingly tasty! I'm definitely gonna get used to this.",
        },
        {
            name: "Tuna Mayo Onigiri",
            weight: 3.5,
            message: "Mmhhhh!!! I love tuna! I love the subtle taste of seaweed as well! This is a good one, {{NICKNAME}}-kun",
        },
        {
            name: "Tuna Mayo Onigiri with Kew*ie mayo",
            weight: 4.5,
            message: "I love tuna mayo already, but you went extra mile for the kew*ie mayo??? Su~ki~~~",
        },
    ],
};

const SuperRareBin: GachaBin = {
    category: "super rare",
    items: [
        {
            name: "Kratingd**ng",
            weight: 4,
            message: "This looks like p*ss...What is this, {{NICKNAME}}-kun?\nHmm? Health Supplement? It will turn me on for a brief moment?! Give me, nya!",
        },
        {
            name: "Burger Nasi GKUB",
            weight: 5,
            message:
                "Hmm... Something pricey... And this small? Alright, not really my favorite because it can get messy real fast, but I do like the flavor!\n",
        },
        {
            name: "Nasi Ayam Mang Otot",
            weight: 7,
            message:
                "Ah I remember this. Not only the fact you can do paylater mechanic with mang otot, they have various of sauces too!\nCan you guess what are my favorite combos of sauce???",
        },
    ],
};

const UltraRareBin: GachaBin = {
    category: "ultra rare",
    items: [
        {
            name: "Whiskas",
            weight: 10,
            message: "WOOAAAAAAAHHH! ARE YOU SURE YOU'RE GIVING ME THIS, NYAA? MMMHHHHHH CAN I CALL YOU MASTER FROM NOW ON?? CAN I??!! CAN I???!!!!!!!",
        },
    ],
};

const MiscBin: GachaBin = {
    category: "misc",
    items: [
        {
            name: "Golden Whiskas",
            weight: 50,
            message: "AFTER 1000 YEARS, IT HAS FINALLY COME, THE GOLDEN WHISKAS!!!!!!!!!!",
        },
    ],
};

const LegendaryRare: GachaBin = {
    category: "legendary rare",
    items: [
        {
            name: "Cucumber",
            weight: -15,
            message: `You're trying to give me a cucumber. What does that even mean???!!\nHIISSSSSSSSSSSSSSSSSSSS--------------------\nI hate you. I HATE YOU! Don't you ever go seeing me again for the next 24 hours.`,
        },
    ],
};
export const GachaPool: GachaPool = {
    normal: NormalBin,
    rare: RareBin,
    "super rare": SuperRareBin,
    "ultra rare": UltraRareBin,
    "legendary rare": LegendaryRare,
    misc: MiscBin,
};

export const GachaRate: { [key in GachaTier]: number } = {
    misc: 0.0375 / 100,
    "legendary rare": 0.6289 / 100,
    "ultra rare": 2.5 / 100,
    "super rare": 8 / 100,
    rare: 25 / 100,
    normal: 1,
};

export const RateUpGachaRate: { [key in GachaTier]: number } = {
    "legendary rare": 0.06289 / 100,
    misc: 1.5 / 100,
    "ultra rare": 10 / 100,
    "super rare": 32 / 100,
    rare: 50 / 100,
    normal: 1,
};

export class GachaFactory {
    private pool: GachaPool;

    constructor() {
        this.pool = GachaPool;
    }

    public gacha(): GachaItem {
        const val = Math.random();
        if (val <= GachaRate.misc) return this.itemGacha(this.pool.misc);
        else if (val <= GachaRate["legendary rare"]) return this.itemGacha(this.pool["legendary rare"]);
        else if (val <= GachaRate["ultra rare"]) return this.itemGacha(this.pool["ultra rare"]);
        else if (val <= GachaRate["super rare"]) return this.itemGacha(this.pool["super rare"]);
        else if (val <= GachaRate.rare) return this.itemGacha(this.pool.rare);
        else return this.itemGacha(this.pool.normal);
    }

    public rateupGacha(): GachaItem {
        const val = Math.random();
        if (val <= RateUpGachaRate["legendary rare"]) return this.itemGacha(this.pool["legendary rare"]);
        else if (val <= RateUpGachaRate.misc) return this.itemGacha(this.pool.misc);
        else if (val <= RateUpGachaRate["ultra rare"]) return this.itemGacha(this.pool["ultra rare"]);
        else if (val <= RateUpGachaRate["super rare"]) return this.itemGacha(this.pool["super rare"]);
        else if (val <= RateUpGachaRate.rare) return this.itemGacha(this.pool.rare);
        else return this.itemGacha(this.pool.normal);
    }

    private itemGacha(itemBin: GachaBin): GachaItem {
        const item = itemBin.items[Math.floor(Math.random() * itemBin.items.length)];
        item.rarity = itemBin.category;
        return item;
    }
}
