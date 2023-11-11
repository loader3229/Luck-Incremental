function calc(dt) {
    player.time += dt
    player.roll_time += dt

    if (player.roll_time >= tmp.rollInt.toNumber() || player.currentChall == 0 || player.currentChall == 4 || player.currentChall == 6 || player.currentChall == 9) {
        roll()
    }

    for (let i in UPGRADES) {
        let a = UPGRADES[i].auto
        if (a&&a()) for (let j in UPGRADES[i].ctn) buyUpgrade(i,j)
    }

    if (hasUpgrade('rp',4)) player.pp = player.pp.add(tmp.ppGain.mul(dt).mul(tmp.upgs.rp.effect[4]))

    if (hasUpgrade('es',5)) player.tp = player.tp.add(tmp.tpGain.mul(dt).mul(tmp.upgs.es.effect[5]))

    if (hasUpgrade('es',10)) player.rp = player.rp.add(tmp.rpGain.mul(dt).mul(tmp.upgs.es.effect[10]))
		
    if (hasUpgrade('es',12)) player.ap = player.ap.add(tmp.apGain.mul(dt).mul(tmp.upgs.es.effect[12]))

    if (hasUpgrade('cl',0)) player.reb = player.reb.add(tmp.rebGain.mul(dt).mul(tmp.upgs.cl.effect[0]))
		
    if (hasUpgrade('se',1)) player.mastery_tier = player.max_rarity.add(1).pow(1/3).ceil().max(player.mastery_tier).toNumber()
		
    if (hasUpgrade('he',2)) player.super_tier = E(player.super_tier).max(player.upgrade.he[2]).toNumber()
		
    if (hasUpgrade('he',2) && player.super_tier >= 8) player.super_tier = E(player.mastery_tier).add(1).pow(1/3).ceil().max(player.super_tier).toNumber()
		
    player.mastery_essence = player.mastery_essence.add(tmp.essGain.mul(dt))

    player.mastery_stone = player.mastery_stone.add(tmp.stoneGain.mul(dt))

    player.mastery_clover = player.mastery_clover.add(tmp.cloverGain.mul(dt))

    player.super_essence = player.super_essence.add(tmp.seGain.mul(dt))
	
    player.hyper_essence = player.hyper_essence.add(tmp.heGain.mul(dt))
	
	if (hasUpgrade('tp',6)||hasUpgrade('rp',5)) player.max_rarity = player.max_rarity.max(LUCK.update())
	
	
	if (player.currentChall != -1) player.chall[player.currentChall] = player.chall[player.currentChall].max(player.max_rarity)
    //roll()
}