var tab = 0
const TABS = {
    unl_length() {
		if (player.hyper_tier >= 1)return 5
		if (player.super_tier >= 100)return 5
		if (player.super_tier >= 1)return 4
		
        let u = 1

        if (player.rTimes>0) u++
        if (hasUpgrade('es',14)) u++
		if (player.mastery_tier >= 100) u++
		if (player.super_tier >= 100) u++

        return u
    },
    sym: `αβγδεζηθικλμνξοπρστυφχψω`,
}

el.setup.tabs = () => {
    let h = ""

    for (let i in TABS.sym) {
        h += `<button id='tabbtn${i}' onclick='tab = ${i}'>${TABS.sym[i]}</button>`
    }

    new Element("tabs").setHTML(h)
}

el.update.tabs = () => {
    let u = TABS.unl_length()

    for (let i in TABS.sym) {
        i = parseInt(i)

        let s = TABS.sym[i], btn = tmp.el['tabbtn' + i]

        btn.setDisplay(i < u && u > 1)

        btn.setTxt(tab == i ? s.toUpperCase() : s)

        if (tmp.el['tab_div'+i]) tmp.el['tab_div'+i].setDisplay(tab == i)
    }
}