function calc(dt) {
    player.time += dt
    player.roll_time += dt

    if (player.roll_time >= tmp.rollInt) {
        roll()
    }

    //roll()
}