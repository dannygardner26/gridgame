# Grid Empire - Game Design Document

## Overview
Grid Empire is a grid-based idle/incremental game where players place resource-generating buildings on an expandable grid, sell resources at fluctuating market prices, and reinvest to grow their empire.

## Core Loop
1. Place buildings on the grid to produce resources (wood, stone, tools)
2. Watch market prices fluctuate (Ornstein-Uhlenbeck mean-reverting process)
3. Sell resources at the Marketplace when prices are high
4. Reinvest coins into new buildings, upgrades, and grid expansion
5. Repeat and scale

## Buildings

| Building    | Cost                          | Effect                                |
|-------------|-------------------------------|---------------------------------------|
| Woods       | 25 coins                      | Produces wood per tick                |
| Mountain    | 40 coins                      | Produces stone per tick               |
| Marketplace | 100 coins                     | Required to sell resources            |
| Bank        | 200c + 50w + 50s              | +2% sell price bonus per level        |
| Tool Shop   | 150c + 30w + 30s              | Consumes wood + stone, produces tools |

All buildings can be upgraded. Upgrade costs scale by `baseCost * costScaling^level`.

## Market System
- Prices follow an Ornstein-Uhlenbeck process (mean-reverting random walk)
- Bounded at ±20% from base price
- Parameters: theta=0.15 (reversion speed), sigma=0.04 (volatility)
- Bank buildings add a percentage bonus to effective sell price

## Grid System
- Starts as 5x5 playable area with locked border ring (7x7 render)
- Locked tiles can be purchased with coins (cost scales with distance from center)
- Grid expands automatically when border tiles are purchased
- Multi-tile buildings planned for future

## Persistence
- Auto-save every 30 seconds
- Save on page unload
- Offline progress calculated on load (capped at 8 hours)

## Future Roadmap
- [ ] Rebirth system: reset for permanent multipliers
- [ ] Multi-tile buildings (2x2, 2x3)
- [ ] Achievements system
- [ ] Prestige currencies
- [ ] Building synergy bonuses (adjacency)
- [ ] Tech tree
- [ ] Events and random encounters
- [ ] Sound effects and music
- [ ] Mobile-responsive layout
- [ ] Cloud save support
