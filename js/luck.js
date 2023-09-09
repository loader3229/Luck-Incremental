const LUCK = {
    mult() {
        let x = E(1)
        x = x.mul(tmp.combo.mult).add(attrEff("luck", 0))
        x = x.mul(upgradeEffect('pp',0)[1]).mul(upgradeEffect('tp',0)[1]).mul(upgradeEffect('rp',0)[1]).mul(upgradeEffect('ap',0)[1]).mul(upgradeEffect('es',0)[1])
        x = x.pow(tmp.mTierEff.luck||1)
        return x
    },
    pow() {
        let x = E(1)
        x = x.mul(upgradeEffect('tp',2)).mul(upgradeEffect('rp',6)).mul(upgradeEffect('es',8))
        return x
    },
    getRarity(rand) {
        return E(rand).pow(tmp.luckPow).mul(tmp.luckMult).log(tmp.luckBase).scale(tmp.raritySS,2,0,true).floor()
    },
    getChance(rarity) {
		return Decimal.pow(tmp.luckBase, rarity.scale(tmp.raritySS,2,0)).div(tmp.luckMult).root(tmp.luckPow)
    },
    generateChance(step) {
		let mult = E(1)
		if (step.gte(1e6)) {
			mult = step.div(1e6)
			step = E(1e6)
		}
        return E(1).sub(Decimal.pow(Math.random(), step.pow(-1))).pow(-1).mul(mult)
    },
    generate(luck = 1) {
        return this.getRarity(luck)
    },
}

const RARITY_PREFIX = ["Generic","Common","Uncommon","Rare","Epic","Legendary",'Mythic','Divine','Almighty','Phenomenal','Preeminent','Inlimitable','Exotic','Ethereal','Scarce','Superior','Astronia','Affinity','Noviax','Endre','Abyxtic']
const RP_LEN = RARITY_PREFIX.length

var show_luck_nav = true

function getRarityName(i) {
	i = E(i)
	let x = i.div(5).floor(), xx = x.div(RP_LEN).floor()

    let h = RARITY_PREFIX[x.sub(xx.mul(RP_LEN)).toNumber()]
	if (xx.gt(0)) h += ` ${format(xx.add(1),0)}`
	h += `<sup>${["--","-","","+","++"][i.sub(x.mul(5)).toNumber()]}</sup>`

    return h+` [${format(i,0)}σ]`
}

function getRarityChance(i) {
    let x = Decimal.pow(tmp.luckBase, i.scale(tmp.raritySS,2,0)).div(tmp.luckMult).root(tmp.luckPow)

    return x.max(1)
}

function roll() {
	if (player.roll_time < tmp.rollInt.toNumber()) return

	let times = E(player.roll_time).div(tmp.rollInt).floor().max(1)	
	if (times.gte(100000)) player.roll_time = 0
    else player.roll_time -= tmp.rollInt.mul(times).toNumber()

	RANDOMIZERS.roll_all(times)
}

tmp_update.push(()=>{
    tmp.raritySS = E(100).add(upgradeEffect('tp',4,0)).add(upgradeEffect('pp',6,0))

	let exp = 2 //^2 with NG-
	exp /= attrEff("scale", 1)

    tmp.luckBase = 1.25 ** exp
    tmp.rollInt = upgradeEffect('pp',1,0).pow(-1).mul(3) //x3 with NG-
	tmp.rollInt = tmp.rollInt.div(attrEff("speed", 1))
    tmp.luckMult = LUCK.mult()
    tmp.luckPow = LUCK.pow()
})

el.update.luck = () => {
    let mr = player.max_rarity
    for (let i = 0; i < 3; i++) {
        let m = mr.add(i)
        let lc = tmp.el['luck_ctn'+i]
        lc.setDisplay(i == 0 || m.lt(9e15))
        if (i > 0 && m.gte(9e15)) continue

        lc.setHTML(`
        <h4>${getRarityName(m)}<br>
		1 / ${LUCK.getChance(m).format()}</h4>
        `)
    }

    tmp.el.roll_btn.setHTML("Roll ("+format(Math.max(tmp.rollInt.toNumber()-player.roll_time,0),1)+"s)")
    tmp.el.auto_roll_btn.setHTML("Auto: " + (player.auto_roll ? "ON" : "OFF"))
}