# RFC 004 - Kratingdaeng

Kratingdaeng is defined as a special drop item from [RFC 001 - Feed](./rfc-001-feed.md). Kratingdaeng carries the behavior that changes the flow of interaction. Currently, it's defined to only change interaction on Feed and only effects player directly.

## Definition
Kratingdaeng follows the standard behavior of `Item` which is a droppable item from gacha. The differences are :
1. Kratingdaeng is stored into player's inventory
2. Kratingdaeng can be stored up to 2^10 items. This is determined by the hard limitation of database but can change if demand or feasibility exist.
3. Kratingdaeng changes the behavior of `feed` interaction. Other effect can be defined if needed.

Kratingdaeng can also be obtained from doing missions. Missions available are : 
- Daily missions which are defined at [RFC 005 - Time Gated Missions](./rfc-005-time-gated-missions.md) and upon clearing will reward user 1 Kratingdaeng
- Weekly missions which are defined on the earlier document, and will reward user 3 Kratingdaeng, and 
- Special missions which will award arbitrary amount of Kratingdaeng.

## Usage

Kratingdaeng can be used through `drink` command, which could have several aliases, and results with the following effects.
1. Cancels out the rate limit guard for one feed only.

Kratingdaeng can be used as currency to perform 10-pull gacha that will result with the following effects.
1. Consumed 10 Kratingdaeng from user's inventory.
2. Increased drop rate for special item bins.

Any additional mechanism is open for suggestion.
