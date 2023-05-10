const UPGRADES = {
    pp: {
        res: ["PP",()=>[player,'pp'],"Prestige Points (PP)"],
        unl: ()=>player.pTimes>0,

        auto: () => hasUpgrade('rp',3),

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('pp',0)[0])} every level.`,
                cost: i => Decimal.pow(3,i),
                bulk: i => i.log(3),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let b = Decimal.add(upgradeEffect('pp',2),2)
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Decrease auto-roll interval.`,
                cost: i => Decimal.pow(5,i).mul(10),
                bulk: i => i.div(10).log(5),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let x = 1-Decimal.pow(0.8,i.root(2)).toNumber()

                    return x
                },
                effDesc: x => "-"+format(x),
            },{
                desc: () => `Increase PU1's base by +0.5 every level.`,
                cost: i => Decimal.pow(10,i).mul(1e3),
                bulk: i => i.div(1e3).log(10),

                effect(i) {
                    i = i.mul(upgradeEffect('pp',3))

                    let x = i.div(2)
                    if (hasUpgrade('tp',3)) x = x.mul(2)
                    return x
                },
                effDesc: x => "+"+format(x,1),
            },{
                unl: () => player.tTimes>0,

                desc: () => `Previous prestige upgrades are +2.5% stronger per level.`,
                cost: i => Decimal.pow(10,i.pow(2)).mul(1e18),
                bulk: i => i.div(1e18).log(10).root(2),

                effect(i) {
                    let x = i.mul(0.025).add(1)
                    return x
                },
                effDesc: x => formatPercent(x.sub(1))+" stronger",
            },
        ],
    },
    tp: {
        res: ["TP",()=>[player,'tp'],"Transcension Points (TP)"],
        unl: ()=>player.tTimes>0,

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('tp',0)[0])} every level.`,
                cost: i => Decimal.pow(3,i),
                bulk: i => i.log(3),

                effect(i) {
                    let b = E(10)
                    if (hasUpgrade('tp',3)) b = b.add(upgradeEffect('pp',2))
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Double prestige points gain.`,
                cost: i => Decimal.pow(3,i.scale(100,2,0)),
                bulk: i => i.log(3).scale(100,2,0,true),

                effect(i) {
                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Improve randomizer better.`,
                cost: i => Decimal.pow(10,i.pow(2)).mul(1e2),
                bulk: i => i.div(1e2).log(10).root(2),

                effect(i) {
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
                cost: i => Decimal.pow(10,i.pow(1.5)).mul(1e45),
                bulk: i => i.div(1e45).log(10).root(1.5),

                effect(i) {
                    let x = i.mul(10)
                    return x
                },
                effDesc: x => "+"+x.format(0)+" later",
            },
        ],
    },
    rp: {
        res: ["RP",()=>[player,'rp'],"Reincarnation Points (RP)"],
        unl: ()=>player.rTimes>0,

        ctn: [
            {
                desc: () => `Increase luck by ${formatMult(upgradeEffect('rp',0)[0])} every level.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    let b = E(200)
                    let x = b.pow(i)

                    return [b,x]
                },
                effDesc: x => formatMult(x[1]),
            },{
                desc: () => `Multiply prestige points gain by 10.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    let x = Decimal.pow(10,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                desc: () => `Double trancension points gain.`,
                cost: i => Decimal.pow(3,i.pow(1.25)),
                bulk: i => i.log(3).root(1.25),

                effect(i) {
                    let x = Decimal.pow(2,i)

                    return x
                },
                effDesc: x => formatMult(x),
            },{
                oneTime: true,

                desc: () => `Automate PUs, and they no longer spend anything.`,
                cost: i => E(1e4),
            },{
                oneTime: true,

                desc: () => `Passively gain 100% of PP gained on reset every second.`,
                cost: i => E(1e9),
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
    let us = UPGRADES[id], tu = tmp.upgs[id], res = tu.res, unl = !us.unl||us.unl()

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

function resetUpgrades(id) {
    for (let i in UPGRADES[id].ctn) player.upgrade[id][i] = E(0)
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