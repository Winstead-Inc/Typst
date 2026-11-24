#let test() = {
    let path = ("foo", "bar")
    let container = x => x
    let params = ((name: "a", variadic: false, named: false, input: "int"),)
    let def-label = x => "l"
    let func-label = "f"
    let ty-pill = x => x
    let flat-types = x => (x,)
    [(]
    container
    (
        class: "arguments",
        {
            for param in params
            {
                let param-label = label(str(func-label) + "." + param.name)
                [test]
            }
        }
    )
    [)]
}
#test()
