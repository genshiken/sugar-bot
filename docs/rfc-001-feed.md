# RFC 001 - Feed

## Foreword

Feed is an interaction mechanism with Sugar that awards the player points. Points are used to determine Sugar's affection and favorability towards player's interaction to Sugar. This can be think as one form of "gacha" mechanism, that is popular from most social games in the market. 

The premise of "feed" interaction is Sugar, as an entity, also need energy to operate. Being a social creature, interaction that relates to someone's well-being is considered as one of the most effective way to shorten the distance in the relationship.

## Mechanism

Feed mechanism is done through messaging `sugar feed` in any place deemed interactable. This has an exception being which user cannot feed through personal means, as `feed` is considered a social feature.

Interaction is limited to just between Sugar and player only. It's currently not planned to have side effect to other players. The nature of social games is to have gacha purely on personal level, though it is not impossible to later define a way to implement Player versus Player (PvP) mechanism.

Feed is rate-limitted with predefined time. Currently it's defined that
> Single player can only feed once in 2 hours

The source of truth will use database where any valid feed action will first check whether there isn't an entry from the user for the last N hours.

## Reward / Gacha

Feed will reward user points according to the feeded item. Feeded item, or dropped item, is determined by pRNG that will pick items from predetermined item bin. Selected item bin is also determined by pRNG. Each item will have hardcoded weight/value that will contribute to total points collected by player.

Pseudo-RNG is used as the main parameter to determine the dropped item. Dropped item is categorized into Item Bins which has rarity assigned to it. Rarity determines the percentage of drop rate that will be used to test against the number generated from RNG.

The definition of Item Bins is the following.
```ts
type ItemBin = {
    name: string,
    maxRange: number,
    items: Item[]
}
```

Item is then defined as the following.
```ts
type Item = {
    name: string,
    value: number,
    message: string
}
```

`maxRange` is defined as number from 0 to 1 which fulfils the following constraint.
1. `maxRange <= 1`
2. `maxRange` determines the area where the result of RNG can yield the selection of the `ItemBin`.
3. Range is determined from 0 to `maxRange`

The selection of `ItemBin` will first test from the smallest range and going up to the last range. Any first test that successful determines the `ItemBin` to pick.

For example, if RNG results with 0.35 and the defined `ItemBin` are the followings : 

  - Common : 1
  - Rare : 0.5
  - Super Rare : 0.25
  - SSR : 0.075  

Then as 0.35 failed SSR (0.35 <= 0.075), then it going to test against Super Rare, which also failed (0.35 <= 0.25), then test against Rare (0.35 <= 0.5) which yields true. `Rare` is then selected for the item bin. This behavior can be customized if demand arises.

Next, item should be selected from item bin, which will be fully randomized. Selected item will then be recorded as player's gacha result.

## Points

Point is saved to database as an entry in `FeedRecord`. It should record the following informations.
1. Feeder (UserID)
2. Item Name
3. Item Value
4. Item Rarity
5. Date(time) Feeded

Feed record doesn't have any tie with external definition for the feed item as it's not defined on database. Due to the nature of hardcoded information, any changes to the codebase should not result in faulty feed record. Feed record should be treated as history that should self-contain necessary information to support the interaction.

