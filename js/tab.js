var tab = 0
const TABS = {
    unl_length() {
        let u = 1
        if (player.pTimes>0||player.max_rarity.gte(10)) u++
        if (player.rTimes>0) u++
        if (hasUpgrade('es',14)) u++
        return u
    },
    sym: `-αβcγδεζηθικλμνξοπρστυφχψω`,
}

el.setup.tabs = () => {
    let h = ""
    for (let i in TABS.sym) h += `<button id='tabbtn${i}' onclick='tab = ${i}'>${TABS.sym[i]}</button>`

    new Element("tabs").setHTML(h)
}

el.update.tabs = () => {
    let u = TABS.unl_length()

    for (let i in TABS.sym) {
        i = parseInt(i)

        let s = TABS.sym[i], btn = tmp.el['tabbtn' + i]

        btn.setDisplay(i < u && u > 1)
        btn.setTxt(tab == i ? (s == "-" ? ">" : s.toUpperCase()) : s)
        if (tmp.el['tab_div'+i]) tmp.el['tab_div'+i].setDisplay(tab == i)
    }
}