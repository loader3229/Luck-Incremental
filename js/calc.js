function calc(dt) {
    player.time += dt
    player.roll_time += dt

    if (player.roll_time >= tmp.rollInt) {
        roll()
    }

    for (let i in UPGRADES) {
        let a = UPGRADES[i].auto
        if (a&&a()) for (let j in UPGRADES[i].ctn) buyUpgrade(i,j)
    }

    if (hasUpgrade('rp',4)) player.pp = player.pp.add(tmp.ppGain.mul(dt).mul(tmp.upgs.rp.effect[4]))

    if (hasUpgrade('es',5)) player.tp = player.tp.add(tmp.tpGain.mul(dt).mul(tmp.upgs.es.effect[5]))

    player.mastery_essence = player.mastery_essence.add(tmp.essGain.mul(dt))

	if (hasUpgrade('tp',6)||hasUpgrade('rp',5)) player.max_rarity = player.max_rarity.max(LUCK.update())
    //roll()
}