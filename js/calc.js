function calc(dt) {
    player.time += dt
    player.roll_time += dt

    if (player.auto_roll) roll()
	else player.roll_time = Math.min(player.roll_time, tmp.rollInt.toNumber())

    for (let i in UPGRADES) {
        let a = UPGRADES[i].auto
        if (a&&a()) for (let j in UPGRADES[i].ctn) buyUpgrade(i,j)
    }

    if (hasUpgrade('rp',4)) player.pp = player.pp.add(tmp.ppGain.mul(dt).mul(tmp.upgs.rp.effect[4]))

    if (hasUpgrade('es',5)) player.tp = player.tp.add(tmp.tpGain.mul(dt).mul(tmp.upgs.es.effect[5]))

    if (hasUpgrade('es',10)) player.rp = player.rp.add(tmp.rpGain.mul(dt).mul(tmp.upgs.es.effect[10]))
		
    if (hasUpgrade('es',12)) player.ap = player.ap.add(tmp.apGain.mul(dt).mul(tmp.upgs.es.effect[12]))

    player.mastery_essence = player.mastery_essence.add(tmp.essGain.mul(dt))

	if (hasUpgrade('tp',6)||hasUpgrade('rp',5)) player.max_rarity = player.max_rarity.max(LUCK.update())
}