//Propserous Luck: NG- section
let NGM = {
	get save() {
		return {
			progress: E(0),
			auto_roll: false,
			randomizers: []
		}
	},
	aura_ch: "green"
}
let AURA = NGM.aura = {}

//Randomizers
let RANDOMIZERS =
NGM.random = {
	get template() {
		return {
			lvl: E(0),
			attr: []
		}
	},

	max: 10,
	get len() {
		let r = 3 + player.max_rarity.div(2).floor().toNumber()
		return Math.min(r, 10)
	},

	roll(b) {
		let r = this.template, luck = LUCK.generateChance(b)
		r.lvl = LUCK.generate(luck)
		for (let [i, a] of Object.entries(ATTR)) {
			if (r.lvl.lt(a.rarity)) continue
			if (LUCK.generateChance(b).lt(1 / a.chance)) continue
			r.attr.push(i)
		}
		return r
	},
	roll_all(b) {
		let rand = player.randomizers, prog = player.progress
		NGM.temp_reload = 1

		for (let i = 0; i < RANDOMIZERS.len; i++) {
			let old_rand = rand[i] ?? this.template, new_rand = this.roll(b)

			let set = !Decimal.isNaN(new_rand.lvl)
			if (old_rand.aura == "green") set = new_rand.lvl.gte(old_rand.lvl)
			if (["yellow", "blue"].includes(old_rand.aura)) set = false
			if (!set) continue

			new_rand.aura = old_rand.aura
			if (attrEff("persist", 0)) {
				let new_attr = [], combine = old_rand.attr.concat(new_rand.attr)
				for (let a in ATTR) if (combine.includes(a)) new_attr.push(a)
				new_rand.attr = new_attr
			}

			rand[i] = new_rand
			if (rand[i].lvl.gt(player.max_rarity)) prog = prog.add(rand[i].lvl).sub(player.max_rarity)
		}
		if (prog.gte(5)) {
			let toAdd = prog.div(5).floor()
			prog = prog.sub(toAdd.mul(5))
			player.max_rarity = player.max_rarity.add(toAdd)
		}

		player.progress = prog
	},

	getAura(x) {
		return (x ?? this.template).aura
	},
	equipAura(x) {
		let aura = NGM.aura_ch, rand = player.randomizers[x] ?? this.template
		player.randomizers[x] = rand

		if (aura == rand.aura) delete rand.aura
		else rand.aura = aura

		AURA[aura].click?.()
		NGM.temp_reload = 1
	},
}

//Combo
let COMBO =
NGM.combo = [
	//Same
	{
		title: "Triplet",
		mult: 0.5,
		find: set => tuple(set, 3)
	}, {
		title: "Four!",
		mult: 1,
		find: set => tuple(set, 4)
	}, {
		title: "Monotonous",
		mult: 1.5,
		find: set => tuple(set, 5)
	},

	//Consecutive
	{
		title: "Friendship",
		mult: 0.5,
		find: set => friendship(set, 1),
	}, {
		title: "1-2-3",
		mult: 1,
		find: set => friendship(set, 2),
	}, {
		title: "Royal Flush",
		mult: 1.5,
		find: set => friendship(set, 3),
	},

	//Misc
	{
		title: "Double Trouble!",
		mult: 1,
		find: set => tuple(set, 2, 2),
	},
]

function tuple(set, x, groups = 1) {
	let count = {}
	for (let i of set.map(i => i.toString())) {
		count[i] = (count[i] || 0) + 1
		if (count[i] == x) groups--
		if (groups == 0) return true
	}
}

function friendship(set, x) {
	let str = set.map(i => i.toString())
	for (let i of str) {
		for (let j = 1; j <= x; j++) {
			if (!str.includes(E(i).add(j).toString())) break
			if (j == x) return true
		}
	}
}

//Green Aura: Casual
AURA.green = {
	unl: _ => true,
	abb: "G",
	color: "#0d0",

	updateHTML() {
		let h = ""
		for (let i of tmp.combo.found) h += `${COMBO[i].title}: +${formatMult(COMBO[i].mult)}<br>`
		h += `Total: ` + formatMult(tmp.combo.mult)
		tmp.el.combo.setHTML(h)
	}
}

//Yellow Aura: Lock + Attributes
AURA.yellow = {
	unl: _ => true,
	abb: "Y",
	color: "#dc0",

	updateHTML() {
		let h = ""
		for (let [i, a] of Object.entries(tmp.attr)) {
			let ad = ATTR[i]
			h += `${ad.disp} ${ad.eff ? `(${ad.effDisp(a)})` : ""}<br>`
		}
		tmp.el.attr.setHTML(h)
	}
}

let ATTR =
NGM.attr = {
	luck: {
		rarity: E(2),
		chance: 0.5,
		disp: "Increase luck.",
		eff: i => i.div(5),
		effDisp: i => "+"+formatMult(i)
	},
	speed: {
		rarity: E(4),
		chance: 0.2,
		disp: "Decrease roll time.",
		eff: i => 3-2/(i.toNumber()/50+1),
		effDisp: i => "/"+format(i)
	},
	scale: {
		rarity: E(8),
		chance: 0.2,
		disp: "Rarity scales faster.",
		eff: i => 2-1/(i.toNumber()/500+1),
		effDisp: i => formatMult(i)
	},
	defense: {
		rarity: E(12),
		chance: 0.1,
		disp: "Increase win chance.",
		eff: i => i.div(200),
		effDisp: i => "+"+formatPercent(i)
	},
	persist: {
		rarity: E(20),
		chance: 0.1,
		disp: "Attributes persist on rolling."
	}
}

function attrEff(x, def) {
	return tmp.attr[x] ?? def
}

//Blue Area: Merge
AURA.blue = {
	unl: _ => player.max_rarity.gte(4),
	abb: "B",
	color: "#05d",

	click() {
		let blue = [], rands = player.randomizers
		for (let [i, rand] of Object.entries(rands)) {
			if (rand.aura != "blue") continue
			blue.push(i)
		}
		if (blue.length != 2) return
		if (!E(rands[blue[0]].lvl).eq(rands[blue[1]].lvl)) return

		rands[blue[0]].lvl = E(rands[blue[0]].lvl).add(1)
		rands[blue[0]].aura = "yellow"
		delete rands[blue[1]]
	},
}

//Red Aura: Arena
AURA.red = {
	unl: _ => player.max_rarity.gte(8),
	abb: "R",
	color: "#d00",

	gamble() {
		let rand = player.randomizers
		if (Math.random() < tmp.win_chance) {
			let max = E(0)
			for (let i of rand) {
				if (!i || i.aura != "red") continue
				max = max.max(i.lvl).min(player.max_rarity)
			}
			for (let i of rand) {
				if (!i || i.aura != "red") continue
				i.lvl = max
			}
			tmp.el.gamble_status.setHTML("You Win!")
		} else {
			for (let i in rand) {
				if (rand[i]?.aura == "red") delete rand[i]
			}
			tmp.el.gamble_status.setHTML("Lost...")
		}
		NGM.temp_reload = 1
	},
	updateHTML() {
		tmp.el.win_chance.setHTML("Chance: " + formatPercent(tmp.win_chance))
	}
}

//Others
NGM.update =
tmp_update.push(()=>{
	if (!NGM.temp_reload) return
	NGM.temp_reload = 0

	tmp.combo = {
		set: [],
		found: [],
		mult: 1
	}
	for (let rand of player.randomizers) {
		if (!rand) continue
		tmp.combo.set.push(E(rand.lvl))
	}
	for (let [i, combo] of Object.entries(COMBO)) {
		if (combo.find(tmp.combo.set)) {
			tmp.combo.found.push(i)
			tmp.combo.mult += combo.mult
		}
	}

	tmp.attr = {}
	for (let rand of player.randomizers) {
		if (!rand || rand.aura != "yellow") continue
		for (let i of rand.attr) tmp.attr[i] = E(rand.lvl).add(tmp.attr[i] || 0)
	}
	for (let i in tmp.attr) {
		if (ATTR[i].eff) tmp.attr[i] = ATTR[i].eff(tmp.attr[i])
	}

	let max = sum = E(0)
	for (let rand of player.randomizers) {
		if (!rand || rand.aura != "red") continue
		let eq = E(1.1).pow(rand.lvl)
		max = max.max(eq)
		sum = sum.add(eq)
	}
	tmp.win_chance = sum.div(max).sqrt().div(3).add(attrEff("defense", 0)).toNumber()
	if (isNaN(tmp.win_chance)) tmp.win_chance = 0

	NGM.reload = 1
})

el.setup.ngm = () => {
	let h = ""
	for (let i = 0; i < RANDOMIZERS.max; i++) h += `<button class='randomizer' id="random_${i}" onclick="RANDOMIZERS.equipAura(${i})"></button>`
	new Element("randomizers").setHTML(h)

	h = ""
	for (let i in AURA) h += `<button id="aura_btn_${i}" style='font-size: 20px' onclick="NGM.aura_ch = '${i}'">${AURA[i].abb}</button>`
	new Element("auras").setHTML(h)

	NGM.temp_reload = 1
}

NGM.tab =
el.update.ngm = ()=>{
	if (tab != 0) return
	for (let i in AURA) {
		tmp.el["aura_"+i].setDisplay(NGM.aura_ch == i)
		tmp.el["aura_btn_"+i].setDisplay(AURA[i].unl())
	}
	AURA[NGM.aura_ch].updateHTML?.()
	if (!NGM.reload) return

	NGM.reload = 0
	for (let i = 0; i < RANDOMIZERS.max; i++) {
		let unl = i < RANDOMIZERS.len
		tmp.el["random_"+i].setDisplay(unl)
		if (!unl || NGM.reload) continue

		let rand = player.randomizers[i] ?? RANDOMIZERS.template
		tmp.el["random_"+i].style["box-shadow"] = rand.aura ? "0 0 12px " + AURA[rand.aura].color : ""

		let attr_h = ``
		for (let a of rand.attr) attr_h += a + "<br>"
		tmp.el["random_"+i].setHTML(`
			<div class="lvl">${getRarityName(rand.lvl)}</div>
			<div class="attr">${attr_h}</div>
		`)
	}
	tmp.el["luck_progress"].setTxt(format(player.progress, 0))
}