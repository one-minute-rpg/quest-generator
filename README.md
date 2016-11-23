# quest-generator

## How to use

1. Clone this project
2. Run `npm install`
3. Run `node index.js [PARAMS]`
    * You can pass the following parameters:
        * `--quest-items` (Number, default 5): number of quest itens.
        * `--hero-items` (Number, default 0): number of hero start itens.
        * `--quest-scenes` (Number, default 50): number of quest scenes.
        * `--file-path` (String, default ./dist/quest.json): the path of generated quest json.

**Sample of usage:** <br />
`node index.js --quest-items 10 --hero-items 3 --quest-scenes 300 --file-path /user/you/quests`


Enjoy =)