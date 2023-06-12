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

    if (hasUpgrade('rp',4)) player.pp = player.pp.add(tmp.ppGain.mul(dt))

    player.mastery_essence = player.mastery_essence.add(tmp.essGain.mul(dt))

    //roll()
}