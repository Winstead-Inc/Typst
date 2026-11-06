const Line = "Matrices and vectors express linear mappings. Inline forms like $mat(1, 2; 3, 4)$ and $vec(x_1, x_2)$ integrate smoothly into text flows.";

console.log("Length:", Line.length);
for (let i = 60; i < 115; i++) {
    console.log(`Col ${i+1} (idx ${i}): '${Line[i]}'`);
}

