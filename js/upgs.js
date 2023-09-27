const UPGRADES = {
    pp: {
        tab: 0,
        res: ["PP",()=>[player,'pp'],"Prestige Points (PP)"],
        unl: ()=>player.pTimes>0,

        auto: () => hasUpgrade('rp',3),

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('pp',0)[0])} every level.`,
                cost: i => i.eq(0)?E(1):Decimal.pow(3,i.scale(E(10000).mul(upgradeEffect('se',11)),2,0)),
                bulk: i => i.log(3).scale(E(10000).mul(upgradeEffect('se',11)),2,0,true),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let b = Decimal.add(upgradeEffect('pp',2),2)
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Decrease auto-roll interval.`,
                cost: i => Decimal.pow(5,i.scale(1000,1.001,1)).mul(10),
                bulk: i => i.div(10).log(5).scale(1000,1.001,1,true),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let x = Decimal.pow(1.25,i.root(1+(hasUpgrade('pp',5)?0.8:1)/(player.chall[0].add(1).log10().div(90).add(1).mul(player.chall[4].add(1).log10().div(90).add(1)).mul(player.chall[6].add(1).log10().div(90).add(1)).mul(player.chall[9].add(1).log10().div(90).add(1)).toNumber())).div(upgradeEffect('se',8)));

                    return x
                },
                effDesc: x => "/"+format(x),
            },{
                desc: () => `Increase PU1's base by +0.5 every level.`,
                cost: i => Decimal.pow(10,i).mul(1e3),
                bulk: i => i.div(1e3).log(10),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let x = i.div(2)
                    if (hasUpgrade('tp',3)) x = x.mul(2)
					if (hasUpgrade('rp',7)) x = x.mul(1.5)
					if (hasUpgrade('ap',6)) x = x.mul(2)
					if (hasUpgrade('es',15)) x = x.mul(upgradeEffect('es',15))
                    return x
                },
                effDesc: x => "+"+format(x,1),
            },{
                unl: () => player.tTimes>0,

                desc: () => `Previous prestige upgrades are +2.5% stronger per level.`,
                cost: i => Decimal.pow(10,i.scale(1000,1.001,1).pow(2)).mul(1e18),
                bulk: i => i.div(1e18).log(10).root(2).scale(1000,1.001,1,true),

                effect(i) {
                    let x = i.mul(0.025).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                unl: () => player.mastery_tier>0,

                desc: () => `Double mastery essence gain.`,
                cost: i => Decimal.pow(1e5,i.scale(100000,2,0).pow(2)).mul(1e100),
                bulk: i => i.div(1e100).log(1e5).root(2).scale(100000,2,0,true),

                effect(i) {
                    let x = Decimal.pow(2,i)
                    return x
                },
                effDesc: x => formatMult(x),
            },{
                unl: () => player.mastery_tier>0,

                oneTime: true,

                desc: () => `PU2 is better.`,
                cost: i => E("1e555"),
            },{
                unl: () => player.mastery_tier>0,

                desc: () => `Post-100σ rarity scaling starts +5 later per level.`,
                cost: i => Decimal.pow(10,i.pow(3)).mul("1e1450"),
                bulk: i => i.div("1e1450").log(10).root(3),

                effect(i) {
                    if(hasUpgrade('st',5))i = i.mul(upgradeEffect('tp',5))
					
                    let x = i.mul(5)
                    return x
                },
                effDesc: x => "+"+x.format(0)+" later",
            },{
                unl: () => player.aTimes>0,

                desc: () => `Boost ascension points gain.`,
                cost: i => Decimal.pow(10,i).mul("1e3000"),
                bulk: i => i.div("1e3000").log(10),

                effect(i) {
                    if(hasUpgrade('st',5))i = i.mul(upgradeEffect('tp',5))
						
                    let x = i.div(100).add(1)
                    return x
                },
                effDesc: x => formatMult(x),
            },
        ],
    },
    tp: {
        tab: 0,
        res: ["TP",()=>[player,'tp'],"Transcension Points (TP)"],
        unl: ()=>player.tTimes>0,

        auto: () => hasUpgrade('es',2),

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('tp',0)[0])} every level.`,
                cost: i => Decimal.pow(3,i.scale(5e10,2,0)),
                bulk: i => i.log(3).scale(5e10,2,0,true),

                effect(i) {
                    i = i.mul(upgradeEffect('tp',5))

                    let b = E(10)
                    if (hasUpgrade('tp',3)) b = b.add(upgradeEffect('pp',2))
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Double prestige points gain.`,
                cost: i => i.eq(0)?E(1):Decimal.pow(3,i.scale(100,hasUpgrade('st',10)?1:2,0)),
                bulk: i => i.log(3).scale(100,hasUpgrade('st',10)?1:2,0,true),

                effect(i) {
                    i = i.mul(upgradeEffect('tp',5))

                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Improve randomizer better.`,
                cost: i => i.eq(0)?E(1e2):Decimal.pow(10,i.pow(1+1/upgradeEffect('se',5,E(1)).toNumber())).mul(1e2),
                bulk: i => i.div(1e2).log(10).root(1+1/upgradeEffect('se',5,E(1)).toNumber()),

                effect(i) {
                    i = i.mul(upgradeEffect('tp',5))

                    let x = i.add(1).root(2)

                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                oneTime: true,

                desc: () => `PU3 is twice as stronger, and it affects TU1's base.`,
                cost: i => E(1e4),
            },{
                unl: () => player.rTimes>0,

                desc: () => `Post-100σ rarity scaling starts +10 later per level.`,
                cost: i => Decimal.pow(10,i.pow(3)).mul(1e60),
                bulk: i => i.div(1e60).log(10).root(3),

                effect(i) {
                    i = i.mul(upgradeEffect('tp',5))

                    let x = i.mul(10)
                    return x
                },
                effDesc: x => "+"+x.format(0)+" later",
            },{
                unl: () => player.mastery_tier>0,

                desc: () => `Previous transcension upgrades are +2.5% stronger per level.`,
                cost: i => Decimal.pow(10,i.scale(1000,1.001,1).scale(5,2,0).pow(2)).mul(1e90),
                bulk: i => i.div(1e90).log(10).root(2).scale(5,2,0,true).scale(1000,1.001,1,true),

                effect(i) {
                    let x = i.mul(0.025).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                oneTime: true,

                desc: () => `Auto-Update your best rarity based on luck.`,
                cost: i => E(1e7),
            },{
                unl: () => player.mastery_tier>0,

                desc: () => `Double mastery essence gain.`,
                cost: i => Decimal.pow(1e5,i.pow(2)).mul("1e450"),
                bulk: i => i.div("1e450").log(1e5).root(2),

                effect(i) {
                    let x = Decimal.pow(2,i)
                    return x
                },
                effDesc: x => formatMult(x),
            },
        ],
    },
    rp: {
        tab: 0,
        res: ["RP",()=>[player,'rp'],"Reincarnation Points (RP)"],
        unl: ()=>player.rTimes>0,

        auto: () => hasUpgrade('es',9),

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('rp',0)[0])} every level.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    i = i.mul(upgradeEffect('ap',7))
					
                    let b = E(200)
                    if (hasUpgrade('rp',7)) b = b.add(upgradeEffect('pp',2))
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Multiply prestige points gain by 10.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    i = i.mul(upgradeEffect('ap',7))
					
                    let x = Decimal.pow(10,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Double trancension points gain.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    i = i.mul(upgradeEffect('ap',7))
					
                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                oneTime: true,

                desc: () => `Automate PUs, and they no longer spend anything.`,
                cost: i => E(1e4),
            },{
                desc: () => `Passively gain PP every second.`,
                cost: i => Decimal.pow(3,i.pow(1.25)).mul(1e9),
                bulk: i => i.div(1e9).log(3).root(1.25),
				
                effect(i) {
                    i = i.mul(upgradeEffect('ap',7))
					
                    let x = i.mul(tmp.upgs.es.effect[6]);

                    return x
                },
                effDesc: x => formatPercent(x)+" of PP gained ("+format(tmp.ppGain.mul(x))+")",
            },{
                oneTime: true,

                desc: () => `Auto-Update your best rarity based on luck.`,
                cost: i => E(1e7),
            },{
                desc: () => `Improve randomizer better.`,
                cost: i => Decimal.pow(10,i).mul(1e65),
                bulk: i => i.div(1e65).log(10),

                effect(i) {
                    i = i.mul(upgradeEffect('ap',7))
					
                    let x = i.add(1).root(2)

                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                oneTime: true,

                desc: () => `PU3 is 1.5x stronger, and it affects RU1's base.`,
                cost: i => E(1e139),
            },
        ],
    },
    ap: {
        tab: 0,
        res: ["AP",()=>[player,'ap'],"Ascension Points (AP)"],
        unl: ()=>player.aTimes>0,

        auto: () => hasUpgrade('es',11),

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('ap',0)[0])} every level.`,
                cost: i => Decimal.pow(1.2,i),
                bulk: i => i.log(1.2),

                effect(i) {
					i = i.mul(upgradeEffect('st',9))
					
                    let b = E(10000)
                    if (hasUpgrade('ap',6)) b = b.add(upgradeEffect('pp',2))
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Multiply prestige points gain by 10,000.`,
                cost: i => Decimal.pow(1.2,i),
                bulk: i => i.log(1.2),

                effect(i) {
					i = i.mul(upgradeEffect('st',9))
					
                    let x = Decimal.pow(10000,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Multiply trancension points gain by 10.`,
                cost: i => Decimal.pow(1.2,i),
                bulk: i => i.log(1.2),

                effect(i) {
					i = i.mul(upgradeEffect('st',9))
					
                    let x = Decimal.pow(10,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Double reincarnation points gain.`,
                cost: i => Decimal.pow(1.2,i),
                bulk: i => i.log(1.2),

                effect(i) {
					i = i.mul(upgradeEffect('st',9))
					
                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Double ascension points gain.`,
                cost: i => Decimal.pow(10,i).mul(1e4),
                bulk: i => i.div(1e4).log(10),

                effect(i) {
                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                unl: () => player.mastery_tier>0,

                desc: () => `Double mastery essence gain.`,
                cost: i => Decimal.pow(5,i).mul(1e5),
                bulk: i => i.div(1e5).log(5),

                effect(i) {
                    let x = Decimal.pow(2,i)
                    return x
                },
                effDesc: x => formatMult(x),
            },{
                oneTime: true,

                desc: () => `PU3 is twice as stronger, and it affects AU1's base.`,
                cost: i => E(1e8),
            },
            {
                desc: () => `RP upgrades 1-3,5,7 are stronger.`,
                cost: i => Decimal.pow(2,i).mul(1e15),
                bulk: i => i.div(1e15).log(2),

                effect(i) {
                    let x = i.mul(0.05).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },
        ],
    },
    es: {
        tab: 1,
        res: ["Mastery Essence",()=>[player,'mastery_essence'],"Mastery Essence"],
        unl: ()=>player.mastery_tier>0,

        auto: () => hasUpgrade('st',4),
        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('es',0)[0])} every level (based on mastery essence).`,
                cost: i => Decimal.pow(2,i).mul(10),
                bulk: i => i.div(10).log(2),

                effect(i) {
					i = i.mul(upgradeEffect('st',0))
					
                    let b = player.mastery_essence.add(10).log10().mul(10)
                    if (hasUpgrade('es',15)) b = b.mul(upgradeEffect('pp',2).mul(upgradeEffect('es',15)).add(1))
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Increase PP by ${formatMult(upgradeEffect('es',1)[0])} every level (based on PP).`,
                cost: i => Decimal.pow(3,i).mul(100),
                bulk: i => i.div(100).log(3),

                effect(i) {
					i = i.mul(upgradeEffect('st',0))
					
					
                    let b = player.pp.add(10).log10()
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                oneTime: true,

                desc: () => `Automate TUs, and they no longer spend anything. Keep pre-mastery automation upgrades on reset.`,
                cost: i => E(1e4),
            },{
                desc: () => `Increase TP by ${formatMult(upgradeEffect('es',3)[0])} every level (based on TP).`,
                cost: i => Decimal.pow(4,i).mul(1e4),
                bulk: i => i.div(1e4).log(4),

                effect(i) {
					i = i.mul(upgradeEffect('st',1))
					
                    let b = player.tp.add(10).log10()
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Increase RP by ${formatMult(upgradeEffect('es',4)[0])} every level (based on RP).`,
                cost: i => Decimal.pow(5,i).mul(1e6),
                bulk: i => i.div(1e6).log(5),

                effect(i) {
					i = i.mul(upgradeEffect('st',1))
					
                    let b = player.rp.add(10).log10()
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Passively gain TP every second.`,
                cost: i => Decimal.pow(3,i).mul(3e8),
                bulk: i => i.div(3e8).log(3),
				
                effect(i) {
					i = i.mul(upgradeEffect('st',1))
					
                    let x = i

                    return x
                },
                effDesc: x => formatPercent(x)+" of TP gained ("+format(tmp.tpGain.mul(x))+")",
            },{
                desc: () => `Multiply PP passive gain upgrade.`,
                cost: i => Decimal.pow(3,i).mul(1e11),
                bulk: i => i.div(1e11).log(3),
				
                effect(i) {
					i = i.mul(upgradeEffect('st',1))
					
                    let x = i.add(1)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Double mastery essence gain.`,
                cost: i => Decimal.pow(10,i).mul(1e13),
                bulk: i => i.div(1e13).log(10),
				
                effect(i) {
                    let x = E(2).pow(i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Improve randomizer better.`,
                cost: i => Decimal.pow(10,i).mul(1e20),
                bulk: i => i.div(1e20).log(10),

                effect(i) {

                    let x = i.add(1)

                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                oneTime: true,

                desc: () => `Automate RUs, and they no longer spend anything.`,
                cost: i => E(1e25),
            },{
                desc: () => `Passively gain RP every second.`,
                cost: i => Decimal.pow(10,i).mul(1e30),
                bulk: i => i.div(1e30).log(10),
				
                effect(i) {
					i = i.mul(upgradeEffect('st',7))
					
                    let x = i

                    return x
                },
                effDesc: x => formatPercent(x)+" of RP gained ("+format(tmp.rpGain.mul(x))+")",
            },{
                unl: () => player.aTimes>0,
                oneTime: true,

                desc: () => `Automate AUs, and they no longer spend anything.`,
                cost: i => E(1e57),
            },{
                unl: () => player.aTimes>0,
                desc: () => `Passively gain AP every second.`,
                cost: i => Decimal.pow(10,i).mul(1e68),
                bulk: i => i.div(1e68).log(10),
				
                effect(i) {
					i = i.mul(upgradeEffect('st',7))
					
                    let x = i

                    return x
                },
                effDesc: x => formatPercent(x)+" of AP gained ("+format(tmp.apGain.mul(x))+")",
            },{
                unl: () => player.aTimes>0,

                desc: () => `Boost ascension points gain based on Mastery Tier.`,
                cost: i => Decimal.pow(10,i).mul(1e75),
                bulk: i => i.div(1e75).log(10),

                effect(i) {
					i = i.mul(upgradeEffect('st',7))
					
                    let x = i.mul(player.mastery_tier**2/800).add(1)
                    return x
                },
                effDesc: x => formatMult(x),
            },{
                unl: () => player.aTimes>0,
                oneTime: true,

                desc: () => `Unlock Challenges.`,
                cost: i => E(1e84),
            },{
                unl: () => player.aTimes>0,

                desc: () => `Boost PU3 based on Mastery Tier, and make PU3 affects Mastery Essence Upgrade 1 at an increased rate.`,
                cost: i => Decimal.pow(10,i).mul(1e86),
                bulk: i => i.div(1e86).log(10),

                effect(i) {
					i = i.mul(upgradeEffect('st',7))
					
                    let x = i.mul(player.mastery_tier**2/800).add(1)
                    return x
                },
                effDesc: x => formatMult(x),
            },
        ],
    },
    st: {
        tab: 1,
        res: ["Mastery Stones",()=>[player,'mastery_stone'],"Mastery Stones"],
        unl: ()=>player.mastery_tier>=45,

        auto: () => hasUpgrade('se',3),
        ctn: [
            {
                desc: () => `First 2 Mastery Essence upgrades are stronger.`,
                cost: i => Decimal.pow(2,i).mul(10),
                bulk: i => i.div(10).log(2),

                effect(i) {
					i = i.mul(upgradeEffect('se',6))
					
                    let x = i.mul(0.1).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },
            {
                desc: () => `Mastery Essence upgrades 4-7 are stronger.`,
                cost: i => Decimal.pow(2,i).mul(200),
                bulk: i => i.div(200).log(2),

                effect(i) {
					i = i.mul(upgradeEffect('se',6))
					
                    let x = i.mul(0.05).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                desc: () => `Double mastery essence and mastery stone gain.`,
                cost: i => Decimal.pow(10,i).mul(1000),
                bulk: i => i.div(1000).log(10),

                effect(i) {
                    let x = Decimal.pow(2,i)
                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `AP formula is better.`,
                cost: i => Decimal.pow(1e5,i.root(2)).mul(15000),
                bulk: i => i.div(15000).log(1e5).pow(2),
                effect(i) {
					if(i.lt(1))return 0;
                    return Math.ceil(14000+9000*(1-Decimal.pow(0.9,i.sub(1)).toNumber()));
                },
                effDesc: x => "-"+format(x)+" to Ascension Requirement",
            },{
                oneTime: true,

                desc: () => `Automate Mastery Essence Upgrades, and they no longer spend anything.`,
                cost: i => E(500000),
            },{
                oneTime: true,

                desc: () => `TU5 boost PU6 and PU7.`,
                cost: i => E(1500000),
            },{
                desc: () => `The 1st effect of Mastery Essence is stronger based on Mastery Tier.`,
                cost: i => Decimal.pow(5,i).mul(5000000),
                bulk: i => i.div(5000000).log(5),

                effect(i) {
                    let x = i.mul(player.mastery_tier/100).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },
            {
                desc: () => `Mastery Essence upgrades 11,13,14,16 are stronger.`,
                cost: i => Decimal.pow(2,i).mul(1e11),
                bulk: i => i.div(1e11).log(2),

                effect(i) {
                    let x = i.mul(0.5).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                desc: () => `TP formula is better.`,
                cost: i => Decimal.pow(2e9,i.root(2)).mul(4e12),
                bulk: i => i.div(4e12).log(2e9).pow(2),
                effect(i) {
					if(i.lt(1))return 0;
                    return Math.ceil(50+20*(1-Decimal.pow(0.9,i.sub(1)).toNumber()));
                },
                effDesc: x => "-"+format(x)+" to Transcension Requirement",
            },
            {
                desc: () => `Ascension Upgrades 1-4 are stronger.`,
                cost: i => Decimal.pow(2,i).mul(3e13),
                bulk: i => i.div(3e13).log(2),

                effect(i) {
					i = i.mul(upgradeEffect('se',6))
					
                    let x = i.mul(0.5).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },
            {
                oneTime: true,

                desc: () => `Remove Transcension Upgrade 2 cost scaling`,
                cost: i => E(1e27),

            },{
				
                unl: () => player.super_tier>0,
				
                desc: () => `Double Super Essence gain.`,
                cost: i => Decimal.pow(2,i.pow(2)).mul(1e36),
                bulk: i => i.div(1e36).log(2).root(2),
                effect(i) {
					
                    let x = Decimal.pow(2,i);
                    return x
				},
                effDesc: x => formatMult(x),
            },
        ],
    },
    se: {
        tab: 3,
        res: ["Super Essence",()=>[player,'super_essence'],"Super Essence"],
        unl: ()=>player.super_tier>=1,

        //auto: () => player.super_tier>=111,
        ctn: [
			{
                desc: () => `Double mastery essence and mastery stone gain.`,
                cost: i => Decimal.pow(4,i).mul(1e7),
                bulk: i => i.div(1e7).log(4),

                effect(i) {
                    let x = Decimal.pow(2,i)
                    return x
                },
                effDesc: x => formatMult(x),
            },{
                oneTime: true,

                desc: () => `Automatically Mastery Tier Up (resets nothing)`,
                cost: i => E(1e9),
            },
			{
                desc: () => `Boost Luck Multiplier.`,
                cost: i => Decimal.pow(2,i).mul(1e11),
                bulk: i => i.div(1e11).log(2),

                effect(i) {
                    let x = i.div(10).add(1).softcap(10,3.5,0)
                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                oneTime: true,

                desc: () => `Automate Mastery Stone Upgrades, and they no longer spend anything.`,
                cost: i => E(1e13),
            },{
                oneTime: true,

                desc: () => `Mastery Stone gain and Mastery Tier's delay scaling effect are better.`,
                cost: i => E(2e22),
            },
            {
                desc: () => `Transcension Upgrade 3 cost scaling is weaker.`,
                cost: i => i.eq(0)?E(1e24):Decimal.pow(2,i.scale(E(5).mul(upgradeEffect('se',11)),2,0).pow(2)).mul(1e24),
                bulk: i => i.div(1e24).log(2).root(2).scale(E(5).mul(upgradeEffect('se',11)),2,0,true),
                effect(i) {
                    let x = i.div(4).add(1)
                    return x
                },
            },
            {
                desc: () => `Mastery Stone Upgrades 1,2,10 are stronger.`,
                cost: i => Decimal.pow(2,i.scale(5,2,0)).mul(1e26),
                bulk: i => i.div(1e26).log(2).scale(5,2,0,true),
                effect(i) {
                    let x = i.div(5).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                desc: () => `Super Tier boost First Mastery Tier effect.`,
                cost: i => Decimal.pow(400,i).mul(1e34),
                bulk: i => i.div(1e34).log(400),
                effect(i) {
                    let x = i.div(10).mul(player.super_tier).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },{
                desc: () => `Improve Randomizer, but decrease PU2 effect.`,
                cost: i => Decimal.pow(10,i).mul(1e36),
                bulk: i => i.div(1e36).log(10),
                effect(i) {
                    let x = i.add(1)
                    return x
                },
                effDesc: x => "^"+format(x),
            },{
                oneTime: true,
                desc: () => `No Alpha challenge effect is better.`,
                cost: i => E(1e37),
            },{
                desc: () => `RP formula is better.`,
                cost: i => Decimal.pow(2,i).mul(1e41),
                bulk: i => i.div(1e41).log(2),
                effect(i) {
					if(i.lt(1))return 0;
                    return Math.ceil(100+150*(1-Decimal.pow(0.9,i.sub(1)).toNumber()));
                },
                effDesc: x => "-"+format(x)+" to Reincarnate Requirement",
            },{
                oneTime: true,
                desc: () => `PU1 and Super Essence Upgrade 6 cost scaling starts later.`,
                cost: i => E(5e47),
                effect(i) {
                    let x = i.div(2.4).add(1)
                    return x
                },
            },
        ],
    },
}

const UPG_START_COST = (()=>{
    let x = {}
    for (let id in UPGRADES) x[id] = UPGRADES[id].ctn.map(i => i.cost(E(0)))
    return x
})()

function upgradeEffect(id,i,def=1) { return tmp.upgs[id].effect[i]||def }

function getUpgradeBought(id,i) { return player.upgrade[id][i] }
function hasUpgrade(id,i) { return player.upgrade[id][i].gte(1) }

function updateUpgradesTemp(id) {
    let us = UPGRADES[id], tu = tmp.upgs[id]

    let [p,q] = us.res[1]()

    tu.res = p[q]
    tu.noSpend = us.auto&&us.auto()

    for (let i in us.ctn) {
        let u = us.ctn[i], lvl = getUpgradeBought(id,i)

        tu.cost[i] = u.cost(lvl)
        if (u.effect) tu.effect[i] = u.effect(lvl)
    }
}

function setupUpgradesHTML(id) {
    let us = UPGRADES[id], h = ""

    h += `You have <h3 id="${id}_upgs_res">???</h3> `+us.res[2]+"<br><div>"
    for (let i in us.ctn) {
        let u = us.ctn[i]
        h += `
        <button id='${id}_upg${i}' onclick="buyUpgrade('${id}',${i})">
            ${u.desc()}
        </button>
        `
    }
    h += "</div>"
    new Element(id+"_upgrades_table").setHTML(h)
}

function updateUpgradesHTML(id) {
    let us = UPGRADES[id]

    if (tab != us.tab||0) return;
    
    let tu = tmp.upgs[id], res = tu.res, unl = !us.unl||us.unl()

    tmp.el[id+"_upgrades_table"].setDisplay(unl)

    if (!unl) return;

    tmp.el[id+"_upgs_res"].setHTML(res.format(0))

    for (let i in us.ctn) {
        let u = us.ctn[i], u_el = tmp.el[id+"_upg"+i], unl = !u.unl||u.unl()

        u_el.setDisplay(unl)

        if (!unl) continue;

        let lvl = getUpgradeBought(id,i), cost = tu.cost[i], h = ""

        if (!u.oneTime) h += "[Level " + lvl.format(0) + "]<br>" 
        h += u.desc()
        if (u.effDesc) h += "<br> Effect: " + u.effDesc(tu.effect[i]).bold()
        if (!u.oneTime || lvl.lt(1)) h += "<br>Cost: " + cost.format(0) + " " + us.res[0]

        u_el.setClasses({locked: res.lt(cost) || (u.oneTime && lvl.gte(1))})
        u_el.setHTML(h)
    }
}

function buyUpgrade(id,i) {
    let u = UPGRADES[id], tu = tmp.upgs[id], res = tu.res, cost = tu.cost[i], uu = u.ctn[i]

    if (player.upgrade[id][i].gte(1) && uu.oneTime) return;

    if (res.gte(cost)) {
        if (uu.oneTime) {
            if (!tu.noSpend) {
                let [p,q] = u.res[1]()
                p[q] = p[q].sub(cost)
            }

            player.upgrade[id][i] = E(1)
        } else {
            let bulk = u.ctn[i].bulk(res).add(1).floor()

            if (getUpgradeBought(id,i).lt(bulk)) {
                if (!tu.noSpend) {
                    cost = u.ctn[i].cost(bulk.sub(1))

                    let [p,q] = u.res[1]()
                    p[q] = p[q].sub(cost)
                }

                player.upgrade[id][i] = bulk
            }
        }

        updateUpgradesTemp(id)
    }
}

function resetUpgrades(id, keep=[]) {
    for (let i in UPGRADES[id].ctn) if (!keep.includes(parseInt(i))) player.upgrade[id][i] = E(0)
}

tmp_update.push(()=>{
    for (let id in UPGRADES) {
        updateUpgradesTemp(id)
    }
})

el.setup.upgs = ()=>{
    for (let id in UPGRADES) {
        setupUpgradesHTML(id)
    }
}

el.update.upgs = ()=>{
    for (let id in UPGRADES) {
        updateUpgradesHTML(id)
    }
}