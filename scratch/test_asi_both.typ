#let info = (feature: "my-feature")
#let def-dest = x => "dest"
#let def-target = "target"
#let body = [body]
#let oneliner = [oneliner]
#let html = (li: x => x, span: x => x)

#let test() = {
    let arr = (
        (16, "toggle", "Feature toggle", { [Requires the] raw(info.feature)[feature] })
    )
    let lis = ()
    { lis.push(html.li({ link(def-dest(def-target), body) html.span(oneliner) })) }
}
#test()
