var tmp = {}
var tmp_update = []

function resetTemp() {
    keep = []
    tmp = {
        luckBase: 1.25,
        luckMult: E(1),
        luckPow: E(1),

        mTierEff: {},

        upgs: {},
    }

    for (let id in UPGRADES) {
        tmp.upgs[id] = {
            res: E(0),
            cost: [],
            effect: [],
        }
    }
}

function updateTemp() {
    for (let x = 0; x < tmp_update.length; x++) tmp_update[x]()
}