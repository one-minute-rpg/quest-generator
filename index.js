var fs = require('fs');
var Chance = require('chance');
var chance = new Chance();
var args = process.argv;

var pQuestItems = Number(getParameter('--quest-items', 5));
var pHeroItems = Number(getParameter('--hero-items', 0));
var pQuestScenes = Number(getParameter('--quest-scenes', 50));
var pFilePath = String(getParameter('--file-path', './dist/quest.json'));

var quest = {};
var items = [];
var hero = {};

doTheMagic();

function doTheMagic() {
    buildQuest();
    createQuestFile();
}

function getParameter(paramName, defaultValue) {
    var pIndex = args.indexOf(paramName);

    if(pIndex >= 0) {
        return args[pIndex + 1];
    }

    return defaultValue;
}

function createQuestFile () {
    fs.writeFile(pFilePath, JSON.stringify(quest, null, 4), (err, data) => {
        if(err) {
            return console.error(err);
        }

        console.log('>>>>> DONE =) <<<<<');
        process.exit();
    });
}

function buildQuest() {
    items = createItems();
    hero = createHero();
    quest = createQuestBase();

    quest.hero = hero;
    quest.items = items;
    quest.scenes = createScenes();
};

function createQuestBase() {
    return {
        title: {
            pt_br: chance.sentence({ words: 4 }),
            en_us: chance.sentence({ words: 4 })
        },
        description: {
            pt_br: chance.paragraph({ sentences: 2 }),
            en_us: chance.paragraph({ sentences: 2 })
        },
        hero: {},
        items: {},
        scenes: []
    };
};

function createItems() {
    var items = [];

    for (var i = 0; i < pQuestItems; i++) {
        items.push(createItem());
    };

    return items;
};

function createItem() {
    return {
        item_id: generateId(),
        name: {
            pt_br: chance.sentence({ words: 3 }),
            en_us: chance.sentence({ words: 3 })
        },
        description: {
            pt_br: chance.paragraph({ sentences: 1 }),
            en_us: chance.paragraph({ sentences: 1 })
        },
        type: chance.pickone(['QUEST', 'INVENTORY']),
        events: []
    };
};

function createHero() {
    return {
        attributes: {
            health: chance.d10(),
            strength: chance.d10(),
            agility: chance.d10(),
            intelligence: chance.d10()
        },
        items: createHeroItems()
    };
};

function createHeroItems() {
    var heroItems = [];

    for (var i = 0; i < pHeroItems; i++) {
        var randomItem = chance.pickone(items);
        var item = {};
        item.item_id = randomItem.item_id;
        item.quantity = chance.d6();
        heroItems.push(item);
    };

    return heroItems;
};

function createScenes() {
    var scenes = [];

    for(var i = 0; i < pQuestScenes; i++) {
        scenes.push(createScene());
    }

    return scenes;
}

function createScene() {
    return {
        "scene_id": generateId(),
        "title": {
            "pt_br": chance.sentence({ words: 3 }),
            "en_us": chance.sentence({ words: 3 })
        },
        "text": {
            "pt_br": chance.paragraph({ sentences: 5 }),
            "en_us": chance.paragraph({ sentences: 5 })
        },
        "actions": createSceneActions(),
        "on_die_events": [],
        "type": "DECISION"
    };
}

function createSceneActions() {
    var numberOfActions = chance.d4();
    var actions = [];

    for(var i = 0; i < numberOfActions; i++) {
        actions.push(createSceneAction());
    }

    return actions;
}

function createSceneAction() {
    var mustRequireItems = chance.d100() <= 10;
    var mustRequireAttributeValue = chance.d100() <= 5;
    var requireItems = [];
    var requireAttributeValue = {
        "strength": null,
        "agility": null,
        "intelligence": null
    };

    if(mustRequireItems) {
        requireItems.push({
            item_id: chance.pickone(items).item_id,
            quantity: chance.d4()
        });
    }

    if(mustRequireAttributeValue) {
        var attribute = chance.pickone(["strength", "agility", "intelligence"]);
        var requiredValue = chance.d10();

        requireAttributeValue[attribute] = requiredValue;
    }

    return {
        "text": {
            "pt_br": chance.sentence({ words: 3 }),
            "en_us": chance.sentence({ words: 3 })
        },
        "require_items": requireItems,
        "require_attribute_value": requireAttributeValue,
        "events": []
    };
}

function generateId() {
    return chance.hash();
}